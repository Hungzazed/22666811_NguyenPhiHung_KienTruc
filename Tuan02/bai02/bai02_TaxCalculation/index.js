/**
 * BÀI 2: TÍNH TOÁN THUẾ SẢN PHẨM
 * Áp dụng 3 Design Patterns: STATE, STRATEGY, DECORATOR
 */

console.log("╔════════════════════════════════════════════════════════════════════╗");
console.log("║              BÀI 2: TÍNH TOÁN THUẾ SẢN PHẨM                        ║");
console.log("║     So sánh State, Strategy, Decorator Pattern                    ║");
console.log("╚════════════════════════════════════════════════════════════════════╝\n");

// ============================================================================
// PHẦN 1: STATE PATTERN
// ============================================================================

console.log("\n┌─────────────────────────────────────────────────────────────────────┐");
console.log("│ PHẦN 1: STATE PATTERN - Thuế theo trạng thái sản phẩm              │");
console.log("└─────────────────────────────────────────────────────────────────────┘");

// State Interface
class TaxState {
    calculateTax(product) { throw new Error("Method must be implemented"); }
    getStateName() { throw new Error("Method must be implemented"); }
}

// Concrete States
class StandardTaxState extends TaxState {
    calculateTax(product) {
        const taxRate = 0.10;
        const taxAmount = product.basePrice * taxRate;
        console.log(`   📊 Thuế tiêu dùng thông thường: ${taxRate * 100}%`);
        console.log(`   💵 Thuế: ${taxAmount.toLocaleString('vi-VN')} VNĐ`);
        return { taxRate, taxAmount, totalPrice: product.basePrice + taxAmount };
    }
    getStateName() { return "Thuế tiêu dùng thông thường"; }
}

class VATTaxState extends TaxState {
    calculateTax(product) {
        const taxRate = 0.08;
        const taxAmount = product.basePrice * taxRate;
        console.log(`   📊 Thuế VAT: ${taxRate * 100}%`);
        console.log(`   💵 Thuế: ${taxAmount.toLocaleString('vi-VN')} VNĐ`);
        return { taxRate, taxAmount, totalPrice: product.basePrice + taxAmount };
    }
    getStateName() { return "Thuế VAT"; }
}

class LuxuryTaxState extends TaxState {
    calculateTax(product) {
        const taxRate = 0.20;
        const taxAmount = product.basePrice * taxRate;
        console.log(`   📊 Thuế xa xỉ: ${taxRate * 100}%`);
        console.log(`   💵 Thuế: ${taxAmount.toLocaleString('vi-VN')} VNĐ`);
        return { taxRate, taxAmount, totalPrice: product.basePrice + taxAmount };
    }
    getStateName() { return "Thuế hàng xa xỉ"; }
}

class ExemptTaxState extends TaxState {
    calculateTax(product) {
        console.log(`   📊 Miễn thuế (Hàng thiết yếu)`);
        console.log(`   💵 Thuế: 0 VNĐ`);
        return { taxRate: 0, taxAmount: 0, totalPrice: product.basePrice };
    }
    getStateName() { return "Miễn thuế"; }
}

// Context
class StateProduct {
    constructor(name, basePrice, category) {
        this.name = name;
        this.basePrice = basePrice;
        this.category = category;
        this.taxState = this.determineTaxState(category);
    }
    determineTaxState(category) {
        const states = {
            'food': new ExemptTaxState(),
            'medicine': new ExemptTaxState(),
            'luxury': new LuxuryTaxState(),
            'service': new VATTaxState()
        };
        return states[category] || new StandardTaxState();
    }
    setTaxState(state) { this.taxState = state; }
    calculateFinalPrice() {
        console.log(`\n🛍️  ${this.name}`);
        console.log(`   Giá gốc: ${this.basePrice.toLocaleString('vi-VN')} VNĐ`);
        const result = this.taxState.calculateTax(this);
        console.log(`   💰 TỔNG: ${result.totalPrice.toLocaleString('vi-VN')} VNĐ`);
        return result;
    }
}

// Demo State Pattern
console.log("\n--- Demo State Pattern ---");
const stateProduct1 = new StateProduct("Laptop Gaming", 30000000, 'electronics');
stateProduct1.calculateFinalPrice();

const stateProduct2 = new StateProduct("Thuốc cảm cúm", 50000, 'medicine');
stateProduct2.calculateFinalPrice();

const stateProduct3 = new StateProduct("Túi Hermes", 150000000, 'luxury');
stateProduct3.calculateFinalPrice();

console.log("\n✅ KẾT LUẬN STATE PATTERN:");
console.log("   + Ưu điểm: Tự động áp dụng thuế theo trạng thái");
console.log("   + Nhược điểm: Hơi phức tạp cho trường hợp đơn giản");
console.log("   + Đánh giá: ⭐⭐⭐ TRUNG BÌNH - phù hợp khi thuế theo trạng thái");

// ============================================================================
// PHẦN 2: STRATEGY PATTERN
// ============================================================================

console.log("\n\n┌─────────────────────────────────────────────────────────────────────┐");
console.log("│ PHẦN 2: STRATEGY PATTERN - Các phương pháp tính thuế               │");
console.log("└─────────────────────────────────────────────────────────────────────┘");

// Strategy Interface
class TaxStrategy {
    calculate(basePrice) { throw new Error("Method must be implemented"); }
    getName() { throw new Error("Method must be implemented"); }
}

// Concrete Strategies
class StandardTaxStrategy extends TaxStrategy {
    calculate(basePrice) {
        const taxRate = 0.10;
        return {
            taxRate,
            taxAmount: basePrice * taxRate,
            totalPrice: basePrice + (basePrice * taxRate)
        };
    }
    getName() { return "Thuế tiêu dùng (10%)"; }
}

class VATStrategy extends TaxStrategy {
    calculate(basePrice) {
        const taxRate = 0.08;
        return {
            taxRate,
            taxAmount: basePrice * taxRate,
            totalPrice: basePrice + (basePrice * taxRate)
        };
    }
    getName() { return "Thuế VAT (8%)"; }
}

class LuxuryTaxStrategy extends TaxStrategy {
    calculate(basePrice) {
        const taxRate = 0.20;
        return {
            taxRate,
            taxAmount: basePrice * taxRate,
            totalPrice: basePrice + (basePrice * taxRate)
        };
    }
    getName() { return "Thuế xa xỉ (20%)"; }
}

class ProgressiveTaxStrategy extends TaxStrategy {
    calculate(basePrice) {
        let taxRate;
        if (basePrice < 10000000) taxRate = 0.05;
        else if (basePrice < 50000000) taxRate = 0.10;
        else taxRate = 0.15;
        
        return {
            taxRate,
            taxAmount: basePrice * taxRate,
            totalPrice: basePrice + (basePrice * taxRate)
        };
    }
    getName() { return "Thuế lũy tiến (5-15%)"; }
}

class ExemptTaxStrategy extends TaxStrategy {
    calculate(basePrice) {
        return { taxRate: 0, taxAmount: 0, totalPrice: basePrice };
    }
    getName() { return "Miễn thuế (0%)"; }
}

// Context
class TaxCalculator {
    constructor(strategy = null) { this.strategy = strategy; }
    setStrategy(strategy) { this.strategy = strategy; }
    calculateTax(productName, basePrice) {
        console.log(`\n🛍️  ${productName}`);
        console.log(`   Giá gốc: ${basePrice.toLocaleString('vi-VN')} VNĐ`);
        console.log(`   📊 ${this.strategy.getName()}`);
        const result = this.strategy.calculate(basePrice);
        console.log(`   💵 Thuế: ${result.taxAmount.toLocaleString('vi-VN')} VNĐ`);
        console.log(`   💰 TỔNG: ${result.totalPrice.toLocaleString('vi-VN')} VNĐ`);
        return result;
    }
}

// Demo Strategy Pattern
console.log("\n--- Demo Strategy Pattern ---");
const calculator = new TaxCalculator();

calculator.setStrategy(new StandardTaxStrategy());
calculator.calculateTax("Laptop", 20000000);

calculator.setStrategy(new VATStrategy());
calculator.calculateTax("Dịch vụ tư vấn", 15000000);

calculator.setStrategy(new LuxuryTaxStrategy());
calculator.calculateTax("Túi Gucci", 80000000);

calculator.setStrategy(new ExemptTaxStrategy());
calculator.calculateTax("Gạo", 200000);

console.log("\n--- So sánh các strategy ---");
console.log("\n📱 iPhone 15 Pro Max (35.000.000 VNĐ):");
const strategies = [
    new StandardTaxStrategy(),
    new VATStrategy(),
    new LuxuryTaxStrategy(),
    new ProgressiveTaxStrategy()
];
strategies.forEach(strategy => {
    const result = strategy.calculate(35000000);
    console.log(`   ${strategy.getName()}: ${result.totalPrice.toLocaleString('vi-VN')} VNĐ`);
});

console.log("\n✅ KẾT LUẬN STRATEGY PATTERN:");
console.log("   + Ưu điểm: Linh hoạt chọn thuật toán, dễ thêm mới");
console.log("   + Nhược điểm: Client phải biết sự khác biệt");
console.log("   + Đánh giá: ⭐⭐⭐⭐⭐ RẤT PHÙ HỢP - tốt nhất cho tính thuế");

// ============================================================================
// PHẦN 3: DECORATOR PATTERN
// ============================================================================

console.log("\n\n┌─────────────────────────────────────────────────────────────────────┐");
console.log("│ PHẦN 3: DECORATOR PATTERN - Kết hợp nhiều loại thuế                │");
console.log("└─────────────────────────────────────────────────────────────────────┘");

// Component Interface
class TaxComponent {
    calculate() { throw new Error("Method must be implemented"); }
    getDescription() { throw new Error("Method must be implemented"); }
}

// Concrete Component
class BaseProduct extends TaxComponent {
    constructor(name, price) {
        super();
        this.name = name;
        this.price = price;
    }
    calculate() {
        return {
            basePrice: this.price,
            totalTax: 0,
            finalPrice: this.price,
            breakdown: []
        };
    }
    getDescription() {
        return `${this.name} (${this.price.toLocaleString('vi-VN')} VNĐ)`;
    }
}

// Base Decorator
class TaxDecorator extends TaxComponent {
    constructor(product) {
        super();
        this.product = product;
    }
    calculate() { return this.product.calculate(); }
    getDescription() { return this.product.getDescription(); }
}

// Concrete Decorators
class ConsumptionTaxDecorator extends TaxDecorator {
    constructor(product, rate = 0.10) {
        super(product);
        this.rate = rate;
        this.name = "Thuế tiêu dùng";
    }
    calculate() {
        const result = super.calculate();
        const taxAmount = result.basePrice * this.rate;
        result.breakdown.push({ name: this.name, rate: this.rate, amount: taxAmount });
        result.totalTax += taxAmount;
        result.finalPrice += taxAmount;
        return result;
    }
    getDescription() {
        return super.getDescription() + ` + ${this.name} (${this.rate * 100}%)`;
    }
}

class VATDecorator extends TaxDecorator {
    constructor(product, rate = 0.08) {
        super(product);
        this.rate = rate;
        this.name = "Thuế VAT";
    }
    calculate() {
        const result = super.calculate();
        const taxAmount = result.basePrice * this.rate;
        result.breakdown.push({ name: this.name, rate: this.rate, amount: taxAmount });
        result.totalTax += taxAmount;
        result.finalPrice += taxAmount;
        return result;
    }
    getDescription() {
        return super.getDescription() + ` + ${this.name} (${this.rate * 100}%)`;
    }
}

class LuxuryTaxDecorator extends TaxDecorator {
    constructor(product, rate = 0.20) {
        super(product);
        this.rate = rate;
        this.name = "Thuế xa xỉ";
    }
    calculate() {
        const result = super.calculate();
        const taxAmount = result.basePrice * this.rate;
        result.breakdown.push({ name: this.name, rate: this.rate, amount: taxAmount });
        result.totalTax += taxAmount;
        result.finalPrice += taxAmount;
        return result;
    }
    getDescription() {
        return super.getDescription() + ` + ${this.name} (${this.rate * 100}%)`;
    }
}

class EnvironmentalTaxDecorator extends TaxDecorator {
    constructor(product, rate = 0.05) {
        super(product);
        this.rate = rate;
        this.name = "Thuế môi trường";
    }
    calculate() {
        const result = super.calculate();
        const taxAmount = result.basePrice * this.rate;
        result.breakdown.push({ name: this.name, rate: this.rate, amount: taxAmount });
        result.totalTax += taxAmount;
        result.finalPrice += taxAmount;
        return result;
    }
    getDescription() {
        return super.getDescription() + ` + ${this.name} (${this.rate * 100}%)`;
    }
}

class ImportTaxDecorator extends TaxDecorator {
    constructor(product, rate = 0.15) {
        super(product);
        this.rate = rate;
        this.name = "Thuế nhập khẩu";
    }
    calculate() {
        const result = super.calculate();
        const taxAmount = result.basePrice * this.rate;
        result.breakdown.push({ name: this.name, rate: this.rate, amount: taxAmount });
        result.totalTax += taxAmount;
        result.finalPrice += taxAmount;
        return result;
    }
    getDescription() {
        return super.getDescription() + ` + ${this.name} (${this.rate * 100}%)`;
    }
}

function displayCalculation(product) {
    console.log(`\n${"─".repeat(70)}`);
    console.log(`📦 ${product.getDescription()}`);
    const result = product.calculate();
    console.log(`   💵 Giá gốc: ${result.basePrice.toLocaleString('vi-VN')} VNĐ`);
    if (result.breakdown.length > 0) {
        console.log(`   📊 Chi tiết thuế:`);
        result.breakdown.forEach((tax, i) => {
            console.log(`      ${i + 1}. ${tax.name}: ${tax.amount.toLocaleString('vi-VN')} VNĐ`);
        });
    }
    console.log(`   💰 Tổng thuế: ${result.totalTax.toLocaleString('vi-VN')} VNĐ`);
    console.log(`   💎 TỔNG CỘNG: ${result.finalPrice.toLocaleString('vi-VN')} VNĐ`);
}

// Demo Decorator Pattern
console.log("\n--- Demo Decorator Pattern ---");

console.log("\n1️⃣ Sản phẩm cơ bản (không thuế):");
let decProduct1 = new BaseProduct("Gạo", 50000);
displayCalculation(decProduct1);

console.log("\n2️⃣ Laptop (thuế tiêu dùng):");
let decProduct2 = new BaseProduct("Laptop", 20000000);
decProduct2 = new ConsumptionTaxDecorator(decProduct2);
displayCalculation(decProduct2);

console.log("\n3️⃣ Hàng xa xỉ nhập khẩu (nhiều loại thuế):");
let decProduct3 = new BaseProduct("Túi Hermès", 200000000);
decProduct3 = new ImportTaxDecorator(decProduct3);
decProduct3 = new LuxuryTaxDecorator(decProduct3);
decProduct3 = new VATDecorator(decProduct3);
displayCalculation(decProduct3);

console.log("\n4️⃣ Ô tô nhập khẩu (thuế tổng hợp):");
let decProduct4 = new BaseProduct("Mercedes S-Class", 3000000000);
decProduct4 = new ImportTaxDecorator(decProduct4);
decProduct4 = new ConsumptionTaxDecorator(decProduct4, 0.15);
decProduct4 = new LuxuryTaxDecorator(decProduct4, 0.25);
decProduct4 = new EnvironmentalTaxDecorator(decProduct4);
decProduct4 = new VATDecorator(decProduct4);
displayCalculation(decProduct4);

console.log("\n✅ KẾT LUẬN DECORATOR PATTERN:");
console.log("   + Ưu điểm: Linh hoạt kết hợp nhiều loại thuế");
console.log("   + Nhược điểm: Phức tạp với nhiều decorator");
console.log("   + Đánh giá: ⭐⭐⭐⭐ PHÙ HỢP - tốt khi kết hợp nhiều thuế");