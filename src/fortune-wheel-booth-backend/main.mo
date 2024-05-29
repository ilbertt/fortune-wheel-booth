import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import TrieMap "mo:base/TrieMap";
import Error "mo:base/Error";
import Option "mo:base/Option";
import Random "mo:base/Random";
import Nat "mo:base/Nat";
import Order "mo:base/Order";
import Buffer "mo:base/Buffer";
import TrieSet "mo:base/TrieSet";
import Fuzz "mo:fuzz";

import IcpLedger "canister:icp_ledger";
import ckBtcLedger "canister:ckbtc_ledger";
import ckEthLedger "canister:cketh_ledger";
import ckUsdcLedger "canister:ckusdc_ledger";

shared ({ caller = initialController }) actor class Main() {
  type Prize = {
    #icp : Nat;
    #ckBtc : Nat;
    #ckEth : Nat;
    #ckUsdc : Nat;
    #jackpot;
    #merchTshirt;
    #merchPen;
  };

  type Extraction = {
    extractedAt : Time.Time;
    prize : Prize;
    transactionBlockIndex : ?Nat;
  };

  /// The ?Nat8 is the quantity available for that prize. `null` means unlimited.
  ///
  /// The prizes with a maximum quantity are removed when they reach 0.
  private stable var prizesEntries : [(Prize, ?Nat8)] = [
    // ICP and ckBTC have 8 decimals: 100_000_000
    (#icp(8_200_000), ?10), // 0.082 ICP ~ $1
    (#ckBtc(1_500), ?10), // 0.000015 ckBTC ~ $1
    // ckETH has 18 decimals: 1_000_000_000_000_000_000
    (#ckEth(260_000_000_000_000), ?10), // 0.00026 ckETH ~ $1
    // ckUSDC has 6 decimals: 1_000_000
    (#ckUsdc(1_000_000), ?10), // 1 ckUSDC ~ $1
    (#jackpot, ?20),
    // increase the probability of getting the merch prize by repeating it
    (#merchTshirt, ?12),
    (#merchTshirt, ?12),
    (#merchTshirt, ?12),
    (#merchPen, ?18),
    (#merchPen, ?18),
  ];
  var prizes : Buffer.Buffer<(Prize, ?Nat8)> = Buffer.fromArray(prizesEntries);

  private stable var adminPrincipals = TrieSet.fromArray<Principal>([initialController], Principal.hash, Principal.equal);

  private stable var extractedPrincipalsEntries : [(Principal, Extraction)] = [];
  private let extractedPrincipals = TrieMap.fromEntries<Principal, Extraction>(extractedPrincipalsEntries.vals(), Principal.equal, Principal.hash);

  // persist non-stable structures: https://internetcomputer.org/docs/current/motoko/main/canister-maintenance/upgrades#preupgrade-and-postupgrade-system-methods
  system func preupgrade() {
    prizesEntries := Buffer.toArray(prizes);
    extractedPrincipalsEntries := Iter.toArray(extractedPrincipals.entries());
  };

  system func postupgrade() {
    prizesEntries := [];
    extractedPrincipalsEntries := [];
  };

  private func isAdmin(principal : Principal) : Bool {
    TrieSet.contains(adminPrincipals, principal, Principal.hash(principal), Principal.equal);
  };

  public shared ({ caller }) func addAdmin(principal : Principal) {
    if (not isAdmin(caller)) {
      throw Error.reject("Only admins can add admins");
    };

    if (isAdmin(principal)) {
      throw Error.reject("Admin already exists");
    };

    adminPrincipals := TrieSet.put<Principal>(adminPrincipals, principal, Principal.hash(principal), Principal.equal);
  };

  public shared ({ caller }) func removeAdmin(principal : Principal) {
    if (not isAdmin(caller)) {
      throw Error.reject("Only admins can remove admins");
    };

    if (not isAdmin(principal)) {
      throw Error.reject("Admin does not exist");
    };

    adminPrincipals := TrieSet.delete<Principal>(adminPrincipals, principal, Principal.hash(principal), Principal.equal);
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
      case (#icp(amount)) {
        ?(await transferIcp(receiver, amount));
      };
      case (#ckBtc(amount)) {
        ?(await transferCkBtc(receiver, amount));
      };
      case (#ckEth(amount)) {
        ?(await transferCkEth(receiver, amount));
      };
      case (#ckUsdc(amount)) {
        ?(await transferCkUsdc(receiver, amount));
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
    let lastIndex : Nat = prizes.size() - 1;
    if (lastIndex == 0) {
      return prizes.get(0).0;
    };

    let fuzz = Fuzz.fromBlob(await Random.blob());
    let randIndex = fuzz.nat.randomRange(0, lastIndex);
    let (prize, availableQuantity) = prizes.get(randIndex);

    switch (availableQuantity) {
      case (?qty) {
        if (qty == 1) {
          ignore prizes.remove(randIndex);
        } else {
          prizes.put(randIndex, (prize, ?(qty - 1)));
        };

        prize;
      };
      case (null) {
        // unlimited quantity, just return the prize
        prize;
      };
    };
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

  private func transferCkUsdc(receiver : Principal, amount : Nat) : async Nat {
    if (amount > 1_100_000) {
      throw Error.reject("ckBTC amount must be less than 1_100_000");
    };

    let transferRes = await ckUsdcLedger.icrc1_transfer({
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

  public shared query ({ caller }) func getExtractions() : async [(Principal, Extraction)] {
    if (not isAdmin(caller)) {
      throw Error.reject("Only admins can read extractions");
    };

    Iter.toArray(extractedPrincipals.entries());
  };

  type ManualSendTokens = {
    #icp : Nat;
    #ckBtc : Nat;
    #ckEth : Nat;
    #ckUsdc : Nat;
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
      case (#ckUsdc(amount)) {
        await transferCkUsdc(receiver, amount);
      };
    };
  };

  public shared query ({ caller }) func getAdmins() : async [Principal] {
    if (not isAdmin(caller)) {
      throw Error.reject("Only admins can read admins");
    };

    TrieSet.toArray(adminPrincipals);
  };

  public shared query ({ caller }) func getAvailablePrizes() : async [(Prize, ?Nat8)] {
    if (not isAdmin(caller)) {
      throw Error.reject("Only admins can read prizes");
    };

    Buffer.toArray(prizes);
  };

  public shared ({ caller }) func setAvailablePrizes(newPrizes : [(Prize, ?Nat8)]) {
    if (not isAdmin(caller)) {
      throw Error.reject("Only admins can set prizes");
    };

    prizes := Buffer.fromArray(newPrizes);
  };
};
