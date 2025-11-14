import fs from "fs";
import path from "path";

function buildTree(dir, prefix = "") {
  const items = fs.readdirSync(dir).sort(); // sắp xếp alphabet
  let tree = "";

  items.forEach((item, i) => {
    // Bỏ các folder không cần thiết
    if (["node_modules", ".git", ".next", "build", "dist"].includes(item)) return;

    const fullPath = path.join(dir, item);
    const isDir = fs.lstatSync(fullPath).isDirectory();
    const isLast = i === items.length - 1;

    // Chọn biểu tượng theo loại file
    let icon = "";
    if (isDir) icon = "📁 ";
    else if (/\.(js|jsx|ts|tsx)$/.test(item)) icon = "📄 ";
    else if (/\.module\.css$/.test(item) || /\.css$/.test(item)) icon = "🎨 ";
    else icon = "🗂️ ";

    tree += `${prefix}${isLast ? "└─" : "├─"} ${icon}${item}\n`;

    if (isDir) {
      tree += buildTree(fullPath, prefix + (isLast ? "   " : "│  "));
    }
  });

  return tree;
}

// Thư mục gốc project Next.js
const projectDir = path.join(process.cwd(), "websitenjs"); // đổi theo tên thư mục của bạn
const output = "📦 " + path.basename(projectDir) + "\n" + buildTree(projectDir);

// Ghi ra file
fs.writeFileSync("structure.txt", output);
console.log("✅ Created structure.txt successfully!");

