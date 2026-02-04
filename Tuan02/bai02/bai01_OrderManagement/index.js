/**
 * BÀI 1: HỆ THỐNG QUẢN LÝ ĐƠN HÀNG
 * Áp dụng 3 Design Patterns: STATE, STRATEGY, DECORATOR
 */

console.log("╔════════════════════════════════════════════════════════════════════╗");
console.log("║           BÀI 1: HỆ THỐNG QUẢN LÝ ĐƠN HÀNG                        ║");
console.log("║     So sánh State, Strategy, Decorator Pattern                    ║");
console.log("╚════════════════════════════════════════════════════════════════════╝\n");

// ============================================================================
// PHẦN 1: STATE PATTERN
// ============================================================================

console.log("\n┌─────────────────────────────────────────────────────────────────────┐");
console.log("│ PHẦN 1: STATE PATTERN - Quản lý trạng thái đơn hàng                │");
console.log("└─────────────────────────────────────────────────────────────────────┘");

// State Interface
class OrderState {
    constructor(order) {
        this.order = order;
    }
    processOrder() {
        throw new Error("Method must be implemented");
    }
    getStatus() {
        throw new Error("Method must be implemented");
    }
}

// Concrete States
class NewOrderState extends OrderState {
    processOrder() {
        console.log("   ✓ Kiểm tra thông tin đơn hàng");
        console.log("   ✓ Xác thực khách hàng");
        console.log("   ✓ Xác nhận tồn kho");
        console.log("   → Chuyển sang: Đang xử lý");
        this.order.setState(new ProcessingState(this.order));
    }
    getStatus() { return "Mới tạo"; }
}

class ProcessingState extends OrderState {
    processOrder() {
        console.log("   ✓ Đóng gói sản phẩm");
        console.log("   ✓ In phiếu giao hàng");
        console.log("   ✓ Bàn giao vận chuyển");
        console.log("   → Chuyển sang: Đã giao");
        this.order.setState(new DeliveredState(this.order));
    }
    getStatus() { return "Đang xử lý"; }
}

class DeliveredState extends OrderState {
    processOrder() {
        console.log("   ✓ Cập nhật đã giao thành công");
        console.log("   ✓ Gửi email xác nhận");
        console.log("   ✓ Yêu cầu đánh giá");
    }
    getStatus() { return "Đã giao"; }
}

class CancelledState extends OrderState {
    processOrder() {
        console.log("   ✓ Hủy đơn hàng");
        console.log("   ✓ Hoàn tiền");
        console.log("   ✓ Cập nhật tồn kho");
    }
    getStatus() { return "Đã hủy"; }
}

// Context
class StateOrder {
    constructor(orderId, customerName, items) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.items = items;
        this.state = new NewOrderState(this);
    }
    setState(state) { this.state = state; }
    process() {
        console.log(`\n📦 Đơn #${this.orderId} - ${this.customerName}`);
        console.log(`   Trạng thái: ${this.state.getStatus()}`);
        this.state.processOrder();
    }
    cancel() {
        console.log(`\n❌ Hủy đơn #${this.orderId}`);
        this.state = new CancelledState(this);
        this.state.processOrder();
    }
}

// Demo State Pattern
console.log("\n--- Demo State Pattern ---");
const stateOrder1 = new StateOrder("STATE001", "Nguyễn Văn A", [
    { name: "Laptop", quantity: 1, price: 20000000 }
]);
stateOrder1.process(); // Mới tạo -> Đang xử lý
stateOrder1.process(); // Đang xử lý -> Đã giao
stateOrder1.process(); // Hoàn tất

const stateOrder2 = new StateOrder("STATE002", "Trần Thị B", [
    { name: "Điện thoại", quantity: 1, price: 15000000 }
]);
stateOrder2.process(); // Mới tạo -> Đang xử lý
stateOrder2.cancel();  // Hủy

console.log("\n✅ KẾT LUẬN STATE PATTERN:");
console.log("   + Ưu điểm: Tách biệt logic trạng thái, loại bỏ if-else");
console.log("   + Nhược điểm: Tăng số lượng class");
console.log("   + Đánh giá: ⭐⭐⭐⭐⭐ RẤT PHÙ HỢP cho quản lý luồng trạng thái");

// ============================================================================
// PHẦN 2: STRATEGY PATTERN
// ============================================================================

console.log("\n\n┌─────────────────────────────────────────────────────────────────────┐");
console.log("│ PHẦN 2: STRATEGY PATTERN - Các chiến lược xử lý đơn hàng           │");
console.log("└─────────────────────────────────────────────────────────────────────┘");

// Strategy Interface
class OrderProcessingStrategy {
    process(order) {
        throw new Error("Method must be implemented");
    }
    getName() {
        throw new Error("Method must be implemented");
    }
}

// Concrete Strategies
class NewOrderProcessingStrategy extends OrderProcessingStrategy {
    process(order) {
        console.log("   📋 Xử lý đơn MỚI TẠO:");
        console.log("   ✓ Kiểm tra thông tin");
        console.log("   ✓ Xác thực khách hàng");
        console.log("   ✓ Xác nhận tồn kho");
        order.status = "Đang xử lý";
        return { success: true, nextStatus: "Đang xử lý" };
    }
    getName() { return "Xử lý đơn mới"; }
}

class ProcessingOrderStrategy extends OrderProcessingStrategy {
    process(order) {
        console.log("   📦 Xử lý đơn ĐANG XỬ LÝ:");
        console.log("   ✓ Đóng gói sản phẩm");
        console.log("   ✓ In phiếu giao hàng");
        console.log("   ✓ Bàn giao vận chuyển");
        order.status = "Đang giao";
        return { success: true, nextStatus: "Đang giao" };
    }
    getName() { return "Xử lý đóng gói"; }
}

class DeliveryOrderStrategy extends OrderProcessingStrategy {
    process(order) {
        console.log("   🚚 Xử lý đơn ĐANG GIAO:");
        console.log("   ✓ Cập nhật vị trí");
        console.log("   ✓ Liên hệ khách hàng");
        console.log("   ✓ Xác nhận giao thành công");
        order.status = "Đã giao";
        return { success: true, nextStatus: "Đã giao" };
    }
    getName() { return "Xử lý giao hàng"; }
}

class CancelOrderStrategy extends OrderProcessingStrategy {
    process(order) {
        console.log("   ❌ Xử lý HỦY ĐƠN:");
        console.log("   ✓ Xác nhận lý do hủy");
        console.log("   ✓ Hoàn tiền");
        console.log("   ✓ Cập nhật tồn kho");
        order.status = "Đã hủy";
        return { success: true, nextStatus: "Đã hủy" };
    }
    getName() { return "Xử lý hủy đơn"; }
}

// Context
class OrderProcessor {
    constructor() { this.strategy = null; }
    setStrategy(strategy) { this.strategy = strategy; }
    processOrder(order) {
        console.log(`\n📦 Đơn #${order.orderId} - ${this.strategy.getName()}`);
        return this.strategy.process(order);
    }
}

class StrategyOrder {
    constructor(orderId, customerName, items, status = "Mới tạo") {
        this.orderId = orderId;
        this.customerName = customerName;
        this.items = items;
        this.status = status;
    }
}

// Demo Strategy Pattern
console.log("\n--- Demo Strategy Pattern ---");
const processor = new OrderProcessor();

const strategyOrder1 = new StrategyOrder("STRATEGY001", "Lê Văn C", [
    { name: "Laptop", quantity: 1, price: 20000000 }
]);

processor.setStrategy(new NewOrderProcessingStrategy());
processor.processOrder(strategyOrder1);

processor.setStrategy(new ProcessingOrderStrategy());
processor.processOrder(strategyOrder1);

processor.setStrategy(new DeliveryOrderStrategy());
processor.processOrder(strategyOrder1);

const strategyOrder2 = new StrategyOrder("STRATEGY002", "Phạm Thị D", [
    { name: "Điện thoại", quantity: 1, price: 15000000 }
], "Đang xử lý");

processor.setStrategy(new CancelOrderStrategy());
processor.processOrder(strategyOrder2);

console.log("\n✅ KẾT LUẬN STRATEGY PATTERN:");
console.log("   + Ưu điểm: Thay đổi thuật toán động, tách biệt logic");
console.log("   + Nhược điểm: Client phải biết sự khác biệt các strategy");
console.log("   + Đánh giá: ⭐⭐⭐⭐ PHÙ HỢP cho nhiều cách xử lý khác nhau");

// ============================================================================
// PHẦN 3: DECORATOR PATTERN
// ============================================================================

console.log("\n\n┌─────────────────────────────────────────────────────────────────────┐");
console.log("│ PHẦN 3: DECORATOR PATTERN - Thêm tính năng cho đơn hàng            │");
console.log("└─────────────────────────────────────────────────────────────────────┘");

// Component Interface
class OrderComponent {
    process() { throw new Error("Method must be implemented"); }
    getDescription() { throw new Error("Method must be implemented"); }
    getCost() { throw new Error("Method must be implemented"); }
}

// Concrete Component
class BasicOrder extends OrderComponent {
    constructor(orderId, customerName, items) {
        super();
        this.orderId = orderId;
        this.customerName = customerName;
        this.items = items;
        this.baseCost = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    process() {
        console.log(`   ✓ Xử lý đơn cơ bản #${this.orderId}`);
        console.log(`   ✓ Khách hàng: ${this.customerName}`);
    }
    getDescription() { return "Đơn hàng cơ bản"; }
    getCost() { return this.baseCost; }
}

// Base Decorator
class OrderDecorator extends OrderComponent {
    constructor(order) {
        super();
        this.order = order;
    }
    process() { this.order.process(); }
    getDescription() { return this.order.getDescription(); }
    getCost() { return this.order.getCost(); }
}

// Concrete Decorators
class PriorityProcessingDecorator extends OrderDecorator {
    process() {
        console.log("\n   🚀 [Xử lý ưu tiên]");
        console.log("   ✓ Đưa lên đầu hàng đợi");
        super.process();
    }
    getDescription() { return super.getDescription() + " + Ưu tiên"; }
    getCost() { return super.getCost() + 50000; }
}

class GiftWrappingDecorator extends OrderDecorator {
    process() {
        console.log("\n   🎁 [Gói quà]");
        console.log("   ✓ Gói sản phẩm đẹp mắt");
        super.process();
    }
    getDescription() { return super.getDescription() + " + Gói quà"; }
    getCost() { return super.getCost() + 20000; }
}

class InsuranceDecorator extends OrderDecorator {
    process() {
        console.log("\n   🛡️  [Bảo hiểm]");
        console.log("   ✓ Bồi thường 100% nếu hỏng");
        super.process();
    }
    getDescription() { return super.getDescription() + " + Bảo hiểm"; }
    getCost() { return super.getCost() + (super.getCost() * 0.02); }
}

class ExpressShippingDecorator extends OrderDecorator {
    process() {
        console.log("\n   ⚡ [Giao hàng nhanh]");
        console.log("   ✓ Giao trong 2h");
        super.process();
    }
    getDescription() { return super.getDescription() + " + Giao nhanh"; }
    getCost() { return super.getCost() + 30000; }
}

class NotificationDecorator extends OrderDecorator {
    process() {
        super.process();
        console.log("\n   📧 [Thông báo]");
        console.log("   ✓ Email, SMS, App");
    }
    getDescription() { return super.getDescription() + " + Thông báo"; }
    getCost() { return super.getCost() + 5000; }
}

// Demo Decorator Pattern
console.log("\n--- Demo Decorator Pattern ---");

console.log("\n1️⃣ Đơn hàng cơ bản:");
let decoratorOrder1 = new BasicOrder("DEC001", "Nguyễn Văn E", [
    { name: "Laptop", quantity: 1, price: 20000000 }
]);
decoratorOrder1.process();
console.log(`💰 Chi phí: ${decoratorOrder1.getCost().toLocaleString('vi-VN')} VNĐ`);
console.log(`📝 Mô tả: ${decoratorOrder1.getDescription()}`);

console.log("\n2️⃣ Đơn hàng VIP (nhiều tính năng):");
let decoratorOrder2 = new BasicOrder("DEC002", "Trần Thị F", [
    { name: "iPhone", quantity: 1, price: 25000000 }
]);
decoratorOrder2 = new PriorityProcessingDecorator(decoratorOrder2);
decoratorOrder2 = new GiftWrappingDecorator(decoratorOrder2);
decoratorOrder2 = new InsuranceDecorator(decoratorOrder2);
decoratorOrder2 = new ExpressShippingDecorator(decoratorOrder2);
decoratorOrder2 = new NotificationDecorator(decoratorOrder2);

decoratorOrder2.process();
console.log(`\n💰 Chi phí: ${decoratorOrder2.getCost().toLocaleString('vi-VN')} VNĐ`);
console.log(`📝 Mô tả: ${decoratorOrder2.getDescription()}`);

console.log("\n✅ KẾT LUẬN DECORATOR PATTERN:");
console.log("   + Ưu điểm: Linh hoạt thêm tính năng, kết hợp tự do");
console.log("   + Nhược điểm: Phức tạp với nhiều decorator");
console.log("   + Đánh giá: ⭐⭐⭐⭐⭐ RẤT PHÙ HỢP cho tính năng bổ sung");