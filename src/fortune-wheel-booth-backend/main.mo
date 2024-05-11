import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import List "mo:base/List";
import TrieMap "mo:base/TrieMap";
import Error "mo:base/Error";
import Option "mo:base/Option";
import Random "mo:base/Random";
import Nat8 "mo:base/Nat8";
import Nat "mo:base/Nat";

import IcpLedger "canister:icp_ledger";
import ckBtcLedger "canister:ckbtc_ledger";
import ckEthLedger "canister:cketh_ledger";

shared ({ caller = initialController }) actor class Main() {
  type Prize = {
    #icp0_5 : Nat;
    #icp1 : Nat;
    #ckBtc0_001 : Nat;
    #ckBtc0_005 : Nat;
    #ckEth0_01 : Nat;
    #ckEth0_05 : Nat;
    #merchTshirt;
    #merchHat;
  };

  type Extraction = {
    extractedAt : Time.Time;
    prize : Prize;
    transactionBlockIndex : ?Nat;
  };

  /// Must have a size that is a power of 2
  /// to have the random index extraction work properly.
  ///
  /// See the comment in the `getRandomPrize` method.
  stable let prizes : [Prize] = [
    // ICP and ckBTC have 8 decimals: 1_000_000_000
    #icp0_5(50_000_000),
    #icp1(100_000_000),
    #ckBtc0_001(100_000),
    #ckBtc0_005(500_000),
    // ckETH has 18 decimals: 1_000_000_000_000_000_000
    #ckEth0_01(10_000_000_000_000_000),
    #ckEth0_05(50_000_000_000_000_000),
    #merchTshirt,
    #merchHat,
  ];

  private stable var adminPrincipals : List.List<Principal> = ?(initialController, null);

  // persist non-stable structures: https://internetcomputer.org/docs/current/motoko/main/canister-maintenance/upgrades#preupgrade-and-postupgrade-system-methods
  private stable var extractedPrincipalsEntries : [(Principal, Extraction)] = [];
  private let extractedPrincipals = TrieMap.fromEntries<Principal, Extraction>(extractedPrincipalsEntries.vals(), Principal.equal, Principal.hash);

  system func preupgrade() {
    extractedPrincipalsEntries := Iter.toArray(extractedPrincipals.entries());
  };

  system func postupgrade() {
    extractedPrincipalsEntries := [];
  };

  private func isAdmin(principal : Principal) : Bool {
    List.some<Principal>(adminPrincipals, func p { p == principal });
  };

  public func addAdmin(principal : Principal) {
    if (isAdmin(principal)) {
      throw Error.reject("Admin already exists");
    };

    adminPrincipals := List.push(principal, adminPrincipals);
  };

  private func isPrincipalExtracted(principal : Principal) : Bool {
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

    let transactionBlockIndex = switch (prize) {
      case (#icp0_5(amount)) {
        ?(await transferIcp(receiver, amount));
      };
      case (#icp1(amount)) {
        ?(await transferIcp(receiver, amount));
      };
      case (#ckBtc0_001(amount)) {
        ?(await transferCkBtc(receiver, amount));
      };
      case (#ckBtc0_005(amount)) {
        ?(await transferCkBtc(receiver, amount));
      };
      case (#ckEth0_01(amount)) {
        ?(await transferCkEth(receiver, amount));
      };
      case (#ckEth0_05(amount)) {
        ?(await transferCkEth(receiver, amount));
      };
      case (_) { null };
    };

    let extraction : Extraction = {
      extractedAt;
      prize;
      transactionBlockIndex;
    };

    extractedPrincipals.put(receiver, extraction);

    extraction;
  };

  private func getRandomPrize() : async Prize {
    let random = Random.Finite(await Random.blob());

    // the result of log(prizes.size())
    // since the random.range method extracts
    // a random number between 0 and (2^rangeExponent) - 1
    let rangeExponent : Nat8 = 3;

    switch (random.range(rangeExponent)) {
      case (?index) { prizes[index] };
      case (null) {
        throw Error.reject("Failed to get random number");
      };
    };
  };

  private func transferIcp(receiver : Principal, amount : Nat) : async Nat {
    let transferRes = await IcpLedger.icrc1_transfer({
      from_subaccount = null;
      to = { owner = receiver; subaccount = null };
      amount;
      fee = null;
      memo = null;
      created_at_time = null;
    });

    switch (transferRes) {
      case (#Ok(value)) {
        value;
      };
      case (#Err(error)) {
        throw Error.reject(debug_show (error));
      };
    };
  };

  private func transferCkBtc(receiver : Principal, amount : Nat) : async Nat {
    let transferRes = await ckBtcLedger.icrc1_transfer({
      from_subaccount = null;
      to = { owner = receiver; subaccount = null };
      amount;
      fee = null;
      memo = null;
      created_at_time = null;
    });

    switch (transferRes) {
      case (#Ok(value)) {
        value;
      };
      case (#Err(error)) {
        throw Error.reject(debug_show (error));
      };
    };
  };

  private func transferCkEth(receiver : Principal, amount : Nat) : async Nat {
    let transferRes = await ckEthLedger.icrc1_transfer({
      from_subaccount = null;
      to = { owner = receiver; subaccount = null };
      amount;
      fee = null;
      memo = null;
      created_at_time = null;
    });

    switch (transferRes) {
      case (#Ok(value)) {
        value;
      };
      case (#Err(error)) {
        throw Error.reject(debug_show (error));
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
