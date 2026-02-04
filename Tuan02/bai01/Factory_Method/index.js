/**
 * Factory Method Pattern - Ví dụ: Hệ thống vận chuyển
 * 
 * Pattern này định nghĩa một interface để tạo đối tượng, nhưng để
 * các lớp con quyết định lớp nào sẽ được khởi tạo.
 */

// Product Interface
class Transport {
    deliver() {
        throw new Error("Method 'deliver()' must be implemented.");
    }
    
    getInfo() {
        throw new Error("Method 'getInfo()' must be implemented.");
    }
}

// Concrete Products
class Truck extends Transport {
    deliver() {
        return "Đang giao hàng bằng xe tải trên đường bộ 🚚";
    }
    
    getInfo() {
        return "Xe tải - Phù hợp cho vận chuyển nội địa, tải trọng lớn";
    }
}

class Ship extends Transport {
    deliver() {
        return "Đang giao hàng bằng tàu thủy trên biển 🚢";
    }
    
    getInfo() {
        return "Tàu thủy - Phù hợp cho vận chuyển quốc tế, số lượng lớn";
    }
}

class Plane extends Transport {
    deliver() {
        return "Đang giao hàng bằng máy bay trên không ✈️";
    }
    
    getInfo() {
        return "Máy bay - Phù hợp cho vận chuyển nhanh, hàng khẩn cấp";
    }
}

class Train extends Transport {
    deliver() {
        return "Đang giao hàng bằng tàu hỏa trên đường ray 🚂";
    }
    
    getInfo() {
        return "Tàu hỏa - Phù hợp cho vận chuyển xuyên lục địa, chi phí thấp";
    }
}

// Creator (Abstract)
class Logistics {
    // Factory Method
    createTransport() {
        throw new Error("Method 'createTransport()' must be implemented.");
    }
    
    // Business logic
    planDelivery() {
        const transport = this.createTransport();
        console.log(`\n📦 Kế hoạch vận chuyển:`);
        console.log(`   ${transport.getInfo()}`);
        console.log(`   ${transport.deliver()}`);
        return transport;
    }
}

// Concrete Creators
class RoadLogistics extends Logistics {
    createTransport() {
        return new Truck();
    }
}

class SeaLogistics extends Logistics {
    createTransport() {
        return new Ship();
    }
}

class AirLogistics extends Logistics {
    createTransport() {
        return new Plane();
    }
}

class RailLogistics extends Logistics {
    createTransport() {
        return new Train();
    }
}

// Client Code
function clientCode(logistics) {
    logistics.planDelivery();
}

// Demo
console.log("========== HỆ THỐNG QUẢN LÝ VẬN CHUYỂN ==========");

console.log("\n--- Giao hàng nội địa ---");
clientCode(new RoadLogistics());

console.log("\n--- Giao hàng quốc tế ---");
clientCode(new SeaLogistics());

console.log("\n--- Giao hàng khẩn cấp ---");
clientCode(new AirLogistics());

console.log("\n--- Giao hàng số lượng lớn ---");
clientCode(new RailLogistics());

console.log("\n" + "=".repeat(50));
