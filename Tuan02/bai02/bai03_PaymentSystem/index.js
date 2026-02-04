/**
 * BÀI 3: HỆ THỐNG THANH TOÁN
 * Áp dụng 3 Design Patterns: STATE, STRATEGY, DECORATOR
 */

console.log("╔════════════════════════════════════════════════════════════════════╗");
console.log("║               BÀI 3: HỆ THỐNG THANH TOÁN                           ║");
console.log("║     So sánh State, Strategy, Decorator Pattern                    ║");
console.log("╚════════════════════════════════════════════════════════════════════╝\n");

// ============================================================================
// PHẦN 1: STATE PATTERN
// ============================================================================

console.log("\n┌─────────────────────────────────────────────────────────────────────┐");
console.log("│ PHẦN 1: STATE PATTERN - Quản lý trạng thái thanh toán              │");
console.log("└─────────────────────────────────────────────────────────────────────┘");

// State Interface
class PaymentState {
    constructor(payment) { this.payment = payment; }
    process() { throw new Error("Method must be implemented"); }
    getStateName() { throw new Error("Method must be implemented"); }
}

// Concrete States
class PendingState extends PaymentState {
    process() {
        console.log("   ⏳ Khởi tạo giao dịch");
        console.log("   ✓ Kiểm tra thông tin");
        console.log("   ✓ Xác thực người dùng");
        console.log("   → Chuyển: Đang xử lý");
        this.payment.setState(new ProcessingState(this.payment));
    }
    getStateName() { return "Chờ xử lý"; }
}

class ProcessingState extends PaymentState {
    process() {
        console.log("   🔄 Đang xử lý thanh toán");
        console.log("   ✓ Kết nối cổng thanh toán");
        console.log("   ✓ Kiểm tra số dư");
        const success = Math.random() > 0.2;
        if (success) {
            console.log("   → Chuyển: Thành công");
            this.payment.setState(new SuccessState(this.payment));
        } else {
            console.log("   → Chuyển: Thất bại");
            this.payment.setState(new FailedState(this.payment));
        }
    }
    getStateName() { return "Đang xử lý"; }
}

class SuccessState extends PaymentState {
    process() {
        console.log("   ✅ Thanh toán thành công!");
        console.log("   ✓ Trừ tiền tài khoản");
        console.log("   ✓ Gửi email xác nhận");
    }
    getStateName() { return "Thành công"; }
}

class FailedState extends PaymentState {
    process() {
        console.log("   ❌ Thanh toán thất bại!");
        console.log("   ✓ Hoàn tác giao dịch");
        console.log("   ✓ Thông báo người dùng");
    }
    getStateName() { return "Thất bại"; }
}

class RefundedState extends PaymentState {
    process() {
        console.log("   🔙 Hoàn tiền");
        console.log("   ✓ Xử lý hoàn tiền");
        console.log("   ✓ Gửi thông báo");
    }
    getStateName() { return "Đã hoàn tiền"; }
}

// Context
class StatePayment {
    constructor(paymentId, amount, method) {
        this.paymentId = paymentId;
        this.amount = amount;
        this.method = method;
        this.state = new PendingState(this);
    }
    setState(state) { this.state = state; }
    process() {
        console.log(`\n💳 Thanh toán #${this.paymentId}`);
        console.log(`   Số tiền: ${this.amount.toLocaleString('vi-VN')} VNĐ`);
        console.log(`   Phương thức: ${this.method}`);
        console.log(`   Trạng thái: ${this.state.getStateName()}`);
        this.state.process();
    }
    refund() {
        console.log(`\n🔄 Hoàn tiền #${this.paymentId}`);
        this.setState(new RefundedState(this));
        this.state.process();
    }
    getStatus() { return this.state.getStateName(); }
}

// Demo State Pattern
console.log("\n--- Demo State Pattern ---");
const statePayment1 = new StatePayment("STATE001", 1500000, "Thẻ tín dụng");
statePayment1.process(); // Pending -> Processing
statePayment1.process(); // Processing -> Success/Failed
statePayment1.process(); // Xác nhận

const statePayment2 = new StatePayment("STATE002", 2000000, "PayPal");
statePayment2.process();
statePayment2.process();
if (statePayment2.getStatus() === "Thành công") {
    statePayment2.refund();
}

console.log("\n✅ KẾT LUẬN STATE PATTERN:");
console.log("   + Ưu điểm: Quản lý rõ ràng trạng thái thanh toán");
console.log("   + Nhược điểm: Tăng số lượng class");
console.log("   + Đánh giá: ⭐⭐⭐ PHÙ HỢP - tốt cho quản lý trạng thái");

// ============================================================================
// PHẦN 2: STRATEGY PATTERN
// ============================================================================

console.log("\n\n┌─────────────────────────────────────────────────────────────────────┐");
console.log("│ PHẦN 2: STRATEGY PATTERN - Các phương thức thanh toán              │");
console.log("└─────────────────────────────────────────────────────────────────────┘");

// Strategy Interface
class PaymentStrategy {
    pay(amount) { throw new Error("Method must be implemented"); }
    validate() { throw new Error("Method must be implemented"); }
    getName() { throw new Error("Method must be implemented"); }
}

// Concrete Strategies
class CreditCardStrategy extends PaymentStrategy {
    constructor(cardNumber, cvv, cardHolder) {
        super();
        this.cardNumber = cardNumber;
        this.cvv = cvv;
        this.cardHolder = cardHolder;
    }
    validate() {
        console.log(`   🔍 Xác thực thẻ: **** ${this.cardNumber.slice(-4)}`);
        console.log(`   ✓ Chủ thẻ: ${this.cardHolder}`);
        return true;
    }
    pay(amount) {
        console.log(`\n💳 Thanh toán THẺ TÍN DỤNG`);
        this.validate();
        console.log("   ✓ Xác thực 3D-Secure");
        console.log(`   💰 Đã thanh toán: ${amount.toLocaleString('vi-VN')} VNĐ`);
        return {
            success: true,
            transactionId: `CC${Date.now()}`,
            method: this.getName(),
            amount: amount,
            fee: amount * 0.03
        };
    }
    getName() { return "Thẻ tín dụng"; }
}

class PayPalStrategy extends PaymentStrategy {
    constructor(email) {
        super();
        this.email = email;
    }
    validate() {
        console.log(`   🔍 Email: ${this.email}`);
        console.log("   ✓ Tài khoản hợp lệ");
        return true;
    }
    pay(amount) {
        console.log(`\n💙 Thanh toán PAYPAL`);
        this.validate();
        console.log("   ✓ Đăng nhập PayPal");
        console.log(`   💰 Đã thanh toán: ${amount.toLocaleString('vi-VN')} VNĐ`);
        return {
            success: true,
            transactionId: `PP${Date.now()}`,
            method: this.getName(),
            amount: amount,
            fee: amount * 0.025
        };
    }
    getName() { return "PayPal"; }
}

class BankTransferStrategy extends PaymentStrategy {
    constructor(bankName, accountNumber) {
        super();
        this.bankName = bankName;
        this.accountNumber = accountNumber;
    }
    validate() {
        console.log(`   🔍 ${this.bankName} - ${this.accountNumber}`);
        console.log("   ✓ Tài khoản hợp lệ");
        return true;
    }
    pay(amount) {
        console.log(`\n🏦 Thanh toán CHUYỂN KHOẢN`);
        this.validate();
        console.log("   ✓ Xác thực OTP");
        console.log(`   💰 Đã thanh toán: ${amount.toLocaleString('vi-VN')} VNĐ`);
        return {
            success: true,
            transactionId: `BT${Date.now()}`,
            method: this.getName(),
            amount: amount,
            fee: 0
        };
    }
    getName() { return "Chuyển khoản"; }
}

class MomoStrategy extends PaymentStrategy {
    constructor(phoneNumber) {
        super();
        this.phoneNumber = phoneNumber;
    }
    validate() {
        console.log(`   🔍 SĐT: ${this.phoneNumber}`);
        console.log("   ✓ Tài khoản Momo hợp lệ");
        return true;
    }
    pay(amount) {
        console.log(`\n📱 Thanh toán VÍ MOMO`);
        this.validate();
        console.log("   ✓ Xác thực PIN");
        console.log(`   💰 Đã thanh toán: ${amount.toLocaleString('vi-VN')} VNĐ`);
        return {
            success: true,
            transactionId: `MM${Date.now()}`,
            method: this.getName(),
            amount: amount,
            fee: amount * 0.01
        };
    }
    getName() { return "Ví Momo"; }
}

class CryptoStrategy extends PaymentStrategy {
    constructor(walletAddress, cryptoType = "Bitcoin") {
        super();
        this.walletAddress = walletAddress;
        this.cryptoType = cryptoType;
    }
    validate() {
        console.log(`   🔍 ${this.cryptoType}: ${this.walletAddress.slice(0, 10)}...`);
        console.log("   ✓ Ví hợp lệ");
        return true;
    }
    pay(amount) {
        console.log(`\n₿ Thanh toán ${this.cryptoType.toUpperCase()}`);
        this.validate();
        console.log("   ✓ Kết nối blockchain");
        console.log(`   💰 Đã thanh toán: ${amount.toLocaleString('vi-VN')} VNĐ`);
        return {
            success: true,
            transactionId: `CR${Date.now()}`,
            method: this.getName(),
            amount: amount,
            fee: amount * 0.005
        };
    }
    getName() { return `Crypto (${this.cryptoType})`; }
}

// Context
class PaymentProcessor {
    constructor() { this.strategy = null; }
    setPaymentStrategy(strategy) { this.strategy = strategy; }
    processPayment(orderId, amount) {
        console.log(`\n${"─".repeat(70)}`);
        console.log(`📦 Đơn hàng: ${orderId} - ${amount.toLocaleString('vi-VN')} VNĐ`);
        const result = this.strategy.pay(amount);
        const totalCost = result.amount + result.fee;
        console.log(`✅ Mã GD: ${result.transactionId} | Phí: ${result.fee.toLocaleString('vi-VN')} VNĐ`);
        console.log(`💎 TỔNG: ${totalCost.toLocaleString('vi-VN')} VNĐ`);
        return result;
    }
}

// Demo Strategy Pattern
console.log("\n--- Demo Strategy Pattern ---");
const processor = new PaymentProcessor();
const amount = 5000000;

processor.setPaymentStrategy(new CreditCardStrategy("1234567890123456", "123", "NGUYEN VAN A"));
processor.processPayment("STRATEGY001", amount);

processor.setPaymentStrategy(new PayPalStrategy("user@example.com"));
processor.processPayment("STRATEGY002", amount);

processor.setPaymentStrategy(new BankTransferStrategy("Vietcombank", "0123456789"));
processor.processPayment("STRATEGY003", amount);

processor.setPaymentStrategy(new MomoStrategy("0901234567"));
processor.processPayment("STRATEGY004", amount);

processor.setPaymentStrategy(new CryptoStrategy("1A1zP1eP5QGefi2DMPTfTL", "Bitcoin"));
processor.processPayment("STRATEGY005", amount);

console.log("\n--- So sánh phí giao dịch ---");
const strategies = [
    new CreditCardStrategy("1234", "123", "User"),
    new PayPalStrategy("user@email.com"),
    new BankTransferStrategy("Bank", "123"),
    new MomoStrategy("0901234567"),
    new CryptoStrategy("wallet", "Bitcoin")
];
console.log("\n📊 Phí cho 5.000.000 VNĐ:");
strategies.forEach(strategy => {
    const result = strategy.pay(amount);
    console.log(`   ${result.method}: ${result.fee.toLocaleString('vi-VN')} VNĐ (${(result.fee/result.amount*100).toFixed(2)}%)`);
});

console.log("\n✅ KẾT LUẬN STRATEGY PATTERN:");
console.log("   + Ưu điểm: Dễ thêm phương thức, linh hoạt chuyển đổi");
console.log("   + Nhược điểm: Client phải biết sự khác biệt");
console.log("   + Đánh giá: ⭐⭐⭐⭐⭐ RẤT PHÙ HỢP - tốt nhất cho thanh toán");

// ============================================================================
// PHẦN 3: DECORATOR PATTERN
// ============================================================================

console.log("\n\n┌─────────────────────────────────────────────────────────────────────┐");
console.log("│ PHẦN 3: DECORATOR PATTERN - Tính năng bổ sung thanh toán           │");
console.log("└─────────────────────────────────────────────────────────────────────┘");

// Component Interface
class PaymentComponent {
    process(amount) { throw new Error("Method must be implemented"); }
    getDescription() { throw new Error("Method must be implemented"); }
    getTotalCost() { throw new Error("Method must be implemented"); }
}

// Concrete Components
class CreditCardPayment extends PaymentComponent {
    constructor(cardHolder) {
        super();
        this.cardHolder = cardHolder;
        this.amount = 0;
    }
    process(amount) {
        this.amount = amount;
        console.log(`\n💳 Thanh toán THẺ - ${this.cardHolder}`);
        console.log(`   Số tiền: ${amount.toLocaleString('vi-VN')} VNĐ`);
        return { baseAmount: amount, totalCost: amount, details: [] };
    }
    getDescription() { return "Thanh toán thẻ tín dụng"; }
    getTotalCost() { return this.amount; }
}

class PayPalPayment extends PaymentComponent {
    constructor(email) {
        super();
        this.email = email;
        this.amount = 0;
    }
    process(amount) {
        this.amount = amount;
        console.log(`\n💙 Thanh toán PAYPAL - ${this.email}`);
        console.log(`   Số tiền: ${amount.toLocaleString('vi-VN')} VNĐ`);
        return { baseAmount: amount, totalCost: amount, details: [] };
    }
    getDescription() { return "Thanh toán PayPal"; }
    getTotalCost() { return this.amount; }
}

// Base Decorator
class PaymentDecorator extends PaymentComponent {
    constructor(payment) {
        super();
        this.payment = payment;
    }
    process(amount) { return this.payment.process(amount); }
    getDescription() { return this.payment.getDescription(); }
    getTotalCost() { return this.payment.getTotalCost(); }
}

// Concrete Decorators
class ProcessingFeeDecorator extends PaymentDecorator {
    constructor(payment, feeRate = 0.03) {
        super(payment);
        this.feeRate = feeRate;
    }
    process(amount) {
        const result = super.process(amount);
        const fee = result.baseAmount * this.feeRate;
        console.log(`   💰 [Phí xử lý ${this.feeRate * 100}%]: ${fee.toLocaleString('vi-VN')} VNĐ`);
        result.details.push({ name: "Phí xử lý", amount: fee });
        result.totalCost += fee;
        return result;
    }
    getDescription() { return super.getDescription() + " + Phí xử lý"; }
}

class DiscountDecorator extends PaymentDecorator {
    constructor(payment, code, rate = 0.10) {
        super(payment);
        this.code = code;
        this.rate = rate;
    }
    process(amount) {
        const result = super.process(amount);
        const discount = result.baseAmount * this.rate;
        console.log(`   🎫 [Mã ${this.code} -${this.rate * 100}%]: -${discount.toLocaleString('vi-VN')} VNĐ`);
        result.details.push({ name: "Giảm giá", amount: -discount });
        result.totalCost -= discount;
        return result;
    }
    getDescription() { return super.getDescription() + ` + Giảm giá ${this.code}`; }
}

class InsuranceDecorator extends PaymentDecorator {
    constructor(payment, rate = 0.02) {
        super(payment);
        this.rate = rate;
    }
    process(amount) {
        const result = super.process(amount);
        const fee = result.baseAmount * this.rate;
        console.log(`   🛡️  [Bảo hiểm ${this.rate * 100}%]: ${fee.toLocaleString('vi-VN')} VNĐ`);
        result.details.push({ name: "Bảo hiểm", amount: fee });
        result.totalCost += fee;
        return result;
    }
    getDescription() { return super.getDescription() + " + Bảo hiểm"; }
}

class LoyaltyPointsDecorator extends PaymentDecorator {
    constructor(payment, pointsRate = 0.05) {
        super(payment);
        this.pointsRate = pointsRate;
    }
    process(amount) {
        const result = super.process(amount);
        const points = Math.floor(result.baseAmount * this.pointsRate / 1000);
        console.log(`   ⭐ [Tích điểm]: +${points} điểm`);
        result.details.push({ name: "Tích điểm", points: points });
        return result;
    }
    getDescription() { return super.getDescription() + " + Tích điểm"; }
}

class CashbackDecorator extends PaymentDecorator {
    constructor(payment, rate = 0.03) {
        super(payment);
        this.rate = rate;
    }
    process(amount) {
        const result = super.process(amount);
        const cashback = result.baseAmount * this.rate;
        console.log(`   💸 [Hoàn tiền ${this.rate * 100}%]: ${cashback.toLocaleString('vi-VN')} VNĐ`);
        result.details.push({ name: "Hoàn tiền", amount: cashback, type: 'cashback' });
        return result;
    }
    getDescription() { return super.getDescription() + " + Hoàn tiền"; }
}

class InstallmentDecorator extends PaymentDecorator {
    constructor(payment, months = 6, interestRate = 0.05) {
        super(payment);
        this.months = months;
        this.interestRate = interestRate;
    }
    process(amount) {
        const result = super.process(amount);
        const interest = result.baseAmount * this.interestRate;
        const monthly = (result.totalCost + interest) / this.months;
        console.log(`   📅 [Trả góp ${this.months} tháng]: ${monthly.toLocaleString('vi-VN')} VNĐ/tháng`);
        result.details.push({ name: "Trả góp", interest: interest, monthly: monthly });
        result.totalCost += interest;
        return result;
    }
    getDescription() { return super.getDescription() + ` + Trả góp ${this.months}T`; }
}

function displayPayment(payment, amount) {
    console.log(`\n${"═".repeat(70)}`);
    console.log(`📝 ${payment.getDescription()}`);
    console.log("═".repeat(70));
    const result = payment.process(amount);
    console.log(`${"─".repeat(70)}`);
    console.log(`💎 TỔNG THANH TOÁN: ${result.totalCost.toLocaleString('vi-VN')} VNĐ`);
}

// Demo Decorator Pattern
console.log("\n--- Demo Decorator Pattern ---");

const payAmount = 10000000;

console.log("\n1️⃣ Thanh toán cơ bản:");
let decPayment1 = new CreditCardPayment("NGUYEN VAN A");
displayPayment(decPayment1, payAmount);

console.log("\n2️⃣ Thanh toán với phí:");
let decPayment2 = new CreditCardPayment("TRAN THI B");
decPayment2 = new ProcessingFeeDecorator(decPayment2);
displayPayment(decPayment2, payAmount);

console.log("\n3️⃣ Thanh toán với giảm giá:");
let decPayment3 = new PayPalPayment("user@example.com");
decPayment3 = new ProcessingFeeDecorator(decPayment3, 0.025);
decPayment3 = new DiscountDecorator(decPayment3, "SUMMER2024", 0.15);
displayPayment(decPayment3, payAmount);

console.log("\n4️⃣ Thanh toán VIP (đầy đủ tính năng):");
let decPayment4 = new CreditCardPayment("LE VAN C");
decPayment4 = new ProcessingFeeDecorator(decPayment4, 0.03);
decPayment4 = new DiscountDecorator(decPayment4, "VIP20", 0.20);
decPayment4 = new InsuranceDecorator(decPayment4, 0.02);
decPayment4 = new LoyaltyPointsDecorator(decPayment4);
decPayment4 = new CashbackDecorator(decPayment4, 0.05);
displayPayment(decPayment4, payAmount);

console.log("\n5️⃣ Thanh toán trả góp:");
let decPayment5 = new CreditCardPayment("PHAM THI D");
decPayment5 = new InstallmentDecorator(decPayment5, 12, 0.08);
decPayment5 = new InsuranceDecorator(decPayment5, 0.01);
displayPayment(decPayment5, payAmount);

console.log("\n✅ KẾT LUẬN DECORATOR PATTERN:");
console.log("   + Ưu điểm: Linh hoạt thêm tính năng, kết hợp tự do");
console.log("   + Nhược điểm: Phức tạp với nhiều decorator");
console.log("   + Đánh giá: ⭐⭐⭐⭐⭐ RẤT PHÙ HỢP - xuất sắc cho tính năng bổ sung");