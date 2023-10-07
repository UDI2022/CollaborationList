// https://qiita.com/nyanchu/items/15d514d9b9f87e5c0a29#:~:text=30%E5%88%86%E3%81%A7%E5%87%BA%E6%9D%A5%E3%82%8B%E3%80%81JavaScript%20%28Electron%29%20%E3%81%A7%E3%83%87%E3%82%B9%E3%82%AF%E3%83%88%E3%83%83%E3%83%97%E3%82%A2%E3%83%97%E3%83%AA%E3%82%92%E4%BD%9C%E3%81%A3%E3%81%A6%E9%85%8D%E5%B8%83%E3%81%99%E3%82%8B%E3%81%BE%E3%81%A7%201%20Node.js%20%2B%20HTML%20%2B,%28Chrome%E3%81%AE%E3%82%AA%E3%83%BC%E3%83%97%E3%83%B3%E3%82%BD%E3%83%BC%E3%82%B9%E7%89%88%29%E3%82%92%E5%86%85%E8%94%B5%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E3%81%AE%E3%81%A7%E3%80%81%E6%99%AE%E6%AE%B5%E3%81%AE%E6%9B%B8%E3%81%8D%E5%91%B3%E3%81%A8%E5%A4%89%E3%82%8F%E3%82%89%E3%81%AA%E3%81%84%202%20%E3%81%93%E3%82%8C1%E3%81%A4%E3%81%A7%20Windows%2C%20Mac%2C%20Linux%20%E5%90%91%E3%81%91%E3%81%AE%E3%82%A2%E3%83%97%E3%83%AA%E3%81%8C%E4%BD%9C%E3%82%8C%E3%82%8B%20%E3%81%9D%E3%81%AE%E4%BB%96%E3%81%AE%E3%82%A2%E3%82%A4%E3%83%86%E3%83%A0

/*基本設定 */

'use strict';

// PASS設定
const path = require('path');
const sqlite3 = require("sqlite3");

// ウィンドウを作成するモジュール
const { app, BrowserWindow } = require('electron');


// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function() {
    if(process.platform != 'darwin') {
        app.quit();
    }
});

// ELecetronの初期化完了後に実行
app.on('ready', function() {
    //メイン画面の表示・ウィンドウの幅、高さを指定できる
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL(`file://${__dirname}/../public/index.html`);

    // ウィンドウが閉じられたらアプリも終了
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});

/*　データベース設定 */
const dbPath = path.join(__dirname, '..', 'database', 'List.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS list(
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        Link1 TEXT,
        Link2 TEXT,
        Link3 TEXT,
        Link4 TEXT,
        Link5 TEXT
    )`);
});

/* 接続したデータベースに情報を配列する機能 */
function addmember(name, Link1, Link2, Link3, Link4, Link5){
    const stmt = db.prepare("INSERT INTO list(name, Link1, Link2, Link3, Link4, Link5) VALUES (?, ?, ?, ?, ?, ?)");
    stmt.run(name, Link1, Link2, Link3, Link4, Link5, function(err) {
        if(err){
            return console.error(err.message);
        }
        console.log("Member added with ID:", this.lastID);
    });
    stmt.finalize();
}

/*データベースから一覧を全て取得し表示する機能 */
function fetchAllMembers(callback) {
    db.all("SELECT * FROM list", [], function(err, rows){
        if(err) {
            console.error(err.u_cant_show_this_list);
            callback([]);
            return;
        }
        callback(rows);
    })
}

// db.close();

