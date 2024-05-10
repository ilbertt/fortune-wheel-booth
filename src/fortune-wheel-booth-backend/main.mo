import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import List "mo:base/List";
import TrieMap "mo:base/TrieMap";
import Error "mo:base/Error";
import Option "mo:base/Option";
import Random "mo:base/Random";
import Nat8 "mo:base/Nat8";

shared ({ caller = initialController }) actor class Main() {
  type Prize = {
    #icp;
    #ckBtc;
    #ckEth;
    #merch;
  };

  type Extraction = {
    extractedAt : Time.Time;
    prize : Prize;
  };

  stable let prizes : [Prize] = [
    #icp,
    #ckBtc,
    #ckEth,
    #merch,
  ];

  private stable var adminPrincipals : List.List<Principal> = ?(initialController, null);

  // persist non-stable structures: https://internetcomputer.org/docs/current/motoko/main/canister-maintenance/upgrades#preupgrade-and-postupgrade-system-methods
  private stable var extractedPrincipalsEntries : [(Principal, Extraction)] = [];
  private let extractedPrincipals = TrieMap.TrieMap<Principal, Extraction>(Principal.equal, Principal.hash);

  system func preupgrade() {
    extractedPrincipalsEntries := Iter.toArray(extractedPrincipals.entries());
  };

  system func postupgrade() {
    extractedPrincipalsEntries := [];
  };

  func isAdmin(principal : Principal) : Bool {
    List.some<Principal>(adminPrincipals, func p { p == principal });
  };

  public func addAdmin(principal : Principal) {
    if (isAdmin(principal)) {
      throw Error.reject("Admin already exists");
    };

    adminPrincipals := List.push(principal, adminPrincipals);
  };

  func isPrincipalExtracted(principal : Principal) : Bool {
    Option.isSome(extractedPrincipals.get(principal));
  };

  public shared ({ caller }) func extract(receiver : Principal) : async Extraction {
    if (not isAdmin(caller)) {
      throw Error.reject("Only admins can extract");
    };

    if (Principal.isAnonymous(receiver)) {
      throw Error.reject("Anonymous principals cannot receive prizes");
    };

    if (Principal.fromText("aaaaa-aa") == receiver) {
      throw Error.reject("Reserved principal cannot receive prizes");
    };

    if (isPrincipalExtracted(receiver)) {
      throw Error.reject("Already extracted for this principal");
    };

    let extractedAt = Time.now();

    let prize = await getRandomPrize();

    let extraction : Extraction = {
      extractedAt;
      prize;
    };

    extractedPrincipals.put(receiver, extraction);

    extraction;
  };

  func getRandomPrize() : async Prize {
    let random = Random.Finite(await Random.blob());

    let prizesCount = Nat8.fromNat(prizes.size());

    switch (random.binomial(prizesCount - 1)) {
      case (?index) { prizes[Nat8.toNat(index)] };
      case (null) {
        throw Error.reject("Failed to get random number");
      };
    };
  };

  public shared query ({ caller }) func getExtraction(principal : Principal) : async ?Extraction {
    if (not isAdmin(caller)) {
      throw Error.reject("Only admins can read extractions");
    };

    extractedPrincipals.get(principal);
  };
};
