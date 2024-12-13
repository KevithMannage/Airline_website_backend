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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchedule = exports.getScheduleByRouteAndDateRange = void 0;
const schedule_model_1 = require("../models/schedule.model");
const getScheduleByRouteAndDateRange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const start = (_a = req.query.start) === null || _a === void 0 ? void 0 : _a.trim();
    const end = (_b = req.query.end) === null || _b === void 0 ? void 0 : _b.trim();
    const from = (_c = req.query.from) === null || _c === void 0 ? void 0 : _c.trim();
    const to = (_d = req.query.to) === null || _d === void 0 ? void 0 : _d.trim();
    if (!start || !end || !from || !to) {
        return res.status(400).send('Missing required query parameters: start, end, from, and to');
    }
    try {
        const rows = yield (0, schedule_model_1.getFutureScheduleByRouteAndDateRange)(start, end, from, to);
        if (rows.length > 0 && rows[0].length > 0) {
            res.json(rows);
        }
        else {
            res.status(404).send('No flights found for the given route and date range');
        }
    }
    catch (err) {
        console.error('Error occurred during procedure execution:', err);
        res.status(500).send('An error occurred while retrieving the schedule');
    }
});
exports.getScheduleByRouteAndDateRange = getScheduleByRouteAndDateRange;
const getSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // console.log(id);
        const schedule = yield (0, schedule_model_1.getScheduleById)(Number(id));
        if (schedule) {
            res.json(schedule);
        }
        else {
            res.status(404).send('Schedule not found');
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Failed to retrieve schedule');
    }
});
exports.getSchedule = getSchedule;
