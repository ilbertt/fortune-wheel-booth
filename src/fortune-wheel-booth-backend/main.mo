import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import List "mo:base/List";
import TrieMap "mo:base/TrieMap";
import Error "mo:base/Error";
import Option "mo:base/Option";
import Random "mo:base/Random";
import Nat "mo:base/Nat";
import Order "mo:base/Order";
import Fuzz "mo:fuzz";

import IcpLedger "canister:icp_ledger";
import ckBtcLedger "canister:ckbtc_ledger";
import ckEthLedger "canister:cketh_ledger";

shared ({ caller = initialController }) actor class Main() {
  type Prize = {
    #icp0_5 : Nat;
    #icp1 : Nat;
    #ckBtc0_0001 : Nat;
    #ckBtc0_0005 : Nat;
    #ckEth0_005 : Nat;
    #ckEth0_01 : Nat;
    #merchTshirt;
    #merchHat;
  };

  type Extraction = {
    extractedAt : Time.Time;
    prize : Prize;
    transactionBlockIndex : ?Nat;
  };

  stable let prizes : [Prize] = [
    // ICP and ckBTC have 8 decimals: 100_000_000
    #icp0_5(50_000_000),
    #icp1(100_000_000),
    #ckBtc0_0001(10_000),
    #ckBtc0_0005(50_000),
    // ckETH has 18 decimals: 1_000_000_000_000_000_000
    #ckEth0_005(5_000_000_000_000_000),
    #ckEth0_01(10_000_000_000_000_000),
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
      throw Error.reject("Anonymous principal cannot receive prizes");
    };

    if (Principal.fromText("aaaaa-aa") == receiver) {
      throw Error.reject("Management canister cannot receive prizes");
    };

    if (isPrincipalExtracted(receiver)) {
      throw Error.reject("Already extracted for this principal");
    };

    let prize = await getRandomPrize();

    let transactionBlockIndex = switch (prize) {
      case (#icp0_5(amount)) {
        ?(await transferIcp(receiver, amount));
      };
      case (#icp1(amount)) {
        ?(await transferIcp(receiver, amount));
      };
      case (#ckBtc0_0001(amount)) {
        ?(await transferCkBtc(receiver, amount));
      };
      case (#ckBtc0_0005(amount)) {
        ?(await transferCkBtc(receiver, amount));
      };
      case (#ckEth0_005(amount)) {
        ?(await transferCkEth(receiver, amount));
      };
      case (#ckEth0_01(amount)) {
        ?(await transferCkEth(receiver, amount));
      };
      case (_) { null };
    };

    let extraction : Extraction = {
      extractedAt = Time.now();
      prize;
      transactionBlockIndex;
    };

    extractedPrincipals.put(receiver, extraction);

    extraction;
  };

  private func getRandomPrize() : async Prize {
    let fuzz = Fuzz.fromBlob(await Random.blob());

    let randIndex = fuzz.nat.randomRange(0, (prizes.size() - 1));
    prizes[randIndex];
  };

  private func transferIcp(receiver : Principal, amount : Nat) : async Nat {
    if (amount > 100_000_000) {
      throw Error.reject("ICP amount must be less than 100_000_000");
    };

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
    if (amount > 50_000) {
      throw Error.reject("ckBTC amount must be less than 50_000");
    };

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
    if (amount > 10_000_000_000_000_000) {
      throw Error.reject("ckETH amount must be less than 10_000_000_000_000_000");
    };

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

  public shared query func getLastExtraction() : async ?(Principal, Extraction) {
    let entries = extractedPrincipals.entries();

    let sorted_entries = Iter.sort(
      entries,
      func(e1 : (Principal, Extraction), e2 : (Principal, Extraction)) : Order.Order {
        // sort descending
        if (e1.1.extractedAt < e2.1.extractedAt) {
          #greater;
        } else {
          #less;
        };
      },
    );

    sorted_entries.next();
  };

  type ManualSendTokens = {
    #icp : Nat;
    #ckBtc : Nat;
    #ckEth : Nat;
  };

  type ManualSendArgs = {
    receiver : Principal;
    tokens : ManualSendTokens;
  };

  public shared ({ caller }) func manualTransfer({ receiver; tokens } : ManualSendArgs) : async Nat {
    if (not isAdmin(caller)) {
      throw Error.reject("Only admins can manually send");
    };

    if (Principal.isAnonymous(receiver)) {
      throw Error.reject("Cannot send to anonymous principal");
    };

    if (Principal.fromText("aaaaa-aa") == receiver) {
      throw Error.reject("Cannot send to management canister");
    };

    switch (tokens) {
      case (#icp(amount)) {
        await transferIcp(receiver, amount);
      };
      case (#ckBtc(amount)) {
        await transferCkBtc(receiver, amount);
      };
      case (#ckEth(amount)) {
        await transferCkEth(receiver, amount);
      };
    };
  };
};
