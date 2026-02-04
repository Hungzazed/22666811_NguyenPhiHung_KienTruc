/**
 * Abstract Factory Pattern - Ví dụ: Hệ thống sản xuất đồ nội thất
 * 
 * Pattern này cung cấp một interface để tạo ra các họ đối tượng liên quan
 * mà không cần chỉ định rõ lớp cụ thể của chúng.
 */

// Abstract Products
class Chair {
    sitOn() {
        throw new Error("Method 'sitOn()' must be implemented.");
    }
}

class Sofa {
    lieOn() {
        throw new Error("Method 'lieOn()' must be implemented.");
    }
}

class Table {
    putOn() {
        throw new Error("Method 'putOn()' must be implemented.");
    }
}

// Concrete Products - Modern Style
class ModernChair extends Chair {
    sitOn() {
        return "Ngồi trên ghế hiện đại với thiết kế tối giản";
    }
}

class ModernSofa extends Sofa {
    lieOn() {
        return "Nằm trên sofa hiện đại với đệm êm ái";
    }
}

class ModernTable extends Table {
    putOn() {
        return "Đặt đồ lên bàn hiện đại với mặt kính sang trọng";
    }
}

// Concrete Products - Victorian Style
class VictorianChair extends Chair {
    sitOn() {
        return "Ngồi trên ghế phong cách Victorian cổ điển";
    }
}

class VictorianSofa extends Sofa {
    lieOn() {
        return "Nằm trên sofa Victorian với họa tiết hoa văn tinh xảo";
    }
}

class VictorianTable extends Table {
    putOn() {
        return "Đặt đồ lên bàn Victorian bằng gỗ sồi chạm khắc";
    }
}

// Concrete Products - Art Deco Style
class ArtDecoChair extends Chair {
    sitOn() {
        return "Ngồi trên ghế Art Deco với đường nét hình học";
    }
}

class ArtDecoSofa extends Sofa {
    lieOn() {
        return "Nằm trên sofa Art Deco với họa tiết đối xứng";
    }
}

class ArtDecoTable extends Table {
    putOn() {
        return "Đặt đồ lên bàn Art Deco với chất liệu kim loại bóng";
    }
}

// Abstract Factory
class FurnitureFactory {
    createChair() {
        throw new Error("Method 'createChair()' must be implemented.");
    }
    
    createSofa() {
        throw new Error("Method 'createSofa()' must be implemented.");
    }
    
    createTable() {
        throw new Error("Method 'createTable()' must be implemented.");
    }
}

// Concrete Factories
class ModernFurnitureFactory extends FurnitureFactory {
    createChair() {
        return new ModernChair();
    }
    
    createSofa() {
        return new ModernSofa();
    }
    
    createTable() {
        return new ModernTable();
    }
}

class VictorianFurnitureFactory extends FurnitureFactory {
    createChair() {
        return new VictorianChair();
    }
    
    createSofa() {
        return new VictorianSofa();
    }
    
    createTable() {
        return new VictorianTable();
    }
}

class ArtDecoFurnitureFactory extends FurnitureFactory {
    createChair() {
        return new ArtDecoChair();
    }
    
    createSofa() {
        return new ArtDecoSofa();
    }
    
    createTable() {
        return new ArtDecoTable();
    }
}

// Client Code
function setupFurniture(factory) {
    const chair = factory.createChair();
    const sofa = factory.createSofa();
    const table = factory.createTable();
    
    console.log(chair.sitOn());
    console.log(sofa.lieOn());
    console.log(table.putOn());
}

// Demo
console.log("========== BỘ NỘI THẤT HIỆN ĐẠI ==========");
const modernFactory = new ModernFurnitureFactory();
setupFurniture(modernFactory);

console.log("\n========== BỘ NỘI THẤT VICTORIAN ==========");
const victorianFactory = new VictorianFurnitureFactory();
setupFurniture(victorianFactory);

console.log("\n========== BỘ NỘI THẤT ART DECO ==========");
const artDecoFactory = new ArtDecoFurnitureFactory();
setupFurniture(artDecoFactory);
