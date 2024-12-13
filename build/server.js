"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const schedule_router_1 = __importDefault(require("./routers/schedule.router"));
const booking_router_1 = __importDefault(require("./routers/booking.router"));
const admin_router_1 = __importDefault(require("./routers/admin.router"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config/config");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
app.use("/user", user_router_1.default);
app.use("/schedule", schedule_router_1.default);
app.use("/booking", booking_router_1.default);
app.use("/admin", admin_router_1.default);
app.get('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows, fields] = yield db_1.default.query('CALL AddReservation(1, "Economy", 2)');
        console.log("ROws", rows);
        console.log("Fields", fields);
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Database query failed');
    }
}));
app.listen(config_1.config.server.port, () => {
    console.log(`Server is running on porttt ${config_1.config.server.port} on herokuuu`);
});
