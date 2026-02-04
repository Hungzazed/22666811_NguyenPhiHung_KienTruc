/**
 * Singleton Pattern - Ví dụ: Database Connection Manager
 * 
 * Pattern này đảm bảo một class chỉ có duy nhất một instance
 * và cung cấp một điểm truy cập toàn cục đến instance đó.
 */

class DatabaseConnection {
    // Biến static để lưu instance duy nhất
    static instance = null;
    
    // Thông tin kết nối
    constructor() {
        if (DatabaseConnection.instance) {
            // Nếu instance đã tồn tại, trả về instance đó
            return DatabaseConnection.instance;
        }
        
        // Khởi tạo các thuộc tính
        this.host = 'localhost';
        this.port = 3306;
        this.database = 'myapp_db';
        this.connectionCount = 0;
        this.isConnected = false;
        this.queries = [];
        
        // Lưu instance
        DatabaseConnection.instance = this;
        
        console.log('✅ Đã tạo Database Connection instance mới');
    }
    
    // Method để kết nối database
    connect() {
        if (this.isConnected) {
            console.log('⚠️  Database đã được kết nối rồi!');
            return;
        }
        
        this.isConnected = true;
        this.connectionCount++;
        console.log(`🔌 Đã kết nối đến database: ${this.database} tại ${this.host}:${this.port}`);
        console.log(`   Số lần kết nối: ${this.connectionCount}`);
    }
    
    // Method để ngắt kết nối
    disconnect() {
        if (!this.isConnected) {
            console.log('⚠️  Database chưa được kết nối!');
            return;
        }
        
        this.isConnected = false;
        console.log('🔌 Đã ngắt kết nối database');
    }
    
    // Method để thực hiện query
    executeQuery(query) {
        if (!this.isConnected) {
            console.log('❌ Lỗi: Chưa kết nối đến database!');
            return null;
        }
        
        this.queries.push({
            query: query,
            timestamp: new Date().toISOString()
        });
        
        console.log(`📝 Thực hiện query: ${query}`);
        return { success: true, data: `Kết quả của: ${query}` };
    }
    
    // Method để lấy thông tin
    getInfo() {
        return {
            host: this.host,
            port: this.port,
            database: this.database,
            isConnected: this.isConnected,
            connectionCount: this.connectionCount,
            totalQueries: this.queries.length
        };
    }
    
    // Static method để lấy instance
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
}

// Demo
console.log("========== SINGLETON PATTERN DEMO ==========\n");

// Thử tạo nhiều instances
console.log("1️⃣ Tạo instance đầu tiên:");
const db1 = new DatabaseConnection();

console.log("\n2️⃣ Tạo instance thứ hai:");
const db2 = new DatabaseConnection();

console.log("\n3️⃣ Lấy instance thông qua static method:");
const db3 = DatabaseConnection.getInstance();

// Kiểm tra xem chúng có phải là cùng một instance không
console.log("\n📊 Kiểm tra instances:");
console.log(`   db1 === db2: ${db1 === db2}`);
console.log(`   db2 === db3: ${db2 === db3}`);
console.log(`   db1 === db3: ${db1 === db3}`);

// Sử dụng database connection
console.log("\n" + "=".repeat(50));
console.log("4️⃣ Sử dụng database connection:\n");

db1.connect();
db1.executeQuery("SELECT * FROM users");
db1.executeQuery("SELECT * FROM products");

console.log("\n5️⃣ Thử kết nối lại từ db2:");
db2.connect(); // Sẽ thông báo đã kết nối rồi

console.log("\n6️⃣ Thực hiện query từ db3:");
db3.executeQuery("INSERT INTO orders VALUES (...)");

console.log("\n7️⃣ Thông tin kết nối:");
const info = db1.getInfo();
console.log(JSON.stringify(info, null, 2));

console.log("\n8️⃣ Ngắt kết nối:");
db2.disconnect();

console.log("\n" + "=".repeat(50));
console.log("\n💡 Kết luận:");
console.log("   - Mặc dù tạo nhiều lần, chỉ có 1 instance duy nhất");
console.log("   - Tất cả biến đều trỏ đến cùng một đối tượng");
console.log("   - Trạng thái được chia sẻ giữa tất cả các tham chiếu");
