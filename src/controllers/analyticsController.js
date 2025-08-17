import Registration from "../models/Registration.js";
import { parseDateOrDefault, defaultRange, sameRangeLastYear, monthRangeFor, quarterRangeFor, previousQuarterRange } from "../utils/dateRanges.js";

function buildMatch({ from, to, state, type, manufacturer }) {
  const match = {};
  if (from || to) {
    match.date = {};
    if (from) match.date.$gte = from;
    if (to) match.date.$lte = to;
  }
  if (state) match.state = state.toUpperCase();
  if (type) match.vehicleType = type;
  if (manufacturer) match.manufacturer = manufacturer;
  return match;
}

export async function health(req, res) {
  res.json({ ok: true, time: new Date() });
}

export async function summary(req, res, next) {
  try {
    const from = parseDateOrDefault(req.query.from);
    const to = parseDateOrDefault(req.query.to);
    const { state, type, manufacturer } = req.query;
    const range = from || to ? { from, to } : defaultRange();

    const match = buildMatch({ ...range, state, type, manufacturer });

    const [agg] = await Registration.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: "$count" } } }
    ]);

    res.json({ filters: { ...req.query, from: range.from, to: range.to }, total: agg?.total || 0 });
  } catch (err) { next(err); }
}

export async function typesDistribution(req, res, next) {
  try {
    const from = parseDateOrDefault(req.query.from);
    const to = parseDateOrDefault(req.query.to);
    const { state } = req.query;
    const range = from || to ? { from, to } : defaultRange();
    const match = buildMatch({ ...range, state });

    const data = await Registration.aggregate([
      { $match: match },
      { $group: { _id: "$vehicleType", total: { $sum: "$count" } } },
      { $project: { _id: 0, vehicleType: "$_id", total: 1 } },
      { $sort: { total: -1 } }
    ]);
    res.json({ filters: { ...req.query, from: range.from, to: range.to }, data });
  } catch (err) { next(err); }
}

export async function topManufacturers(req, res, next) {
  try {
    const from = parseDateOrDefault(req.query.from);
    const to = parseDateOrDefault(req.query.to);
    const { state, type } = req.query;
    const limit = Math.max(1, Math.min(parseInt(req.query.limit || 10), 50));
    const range = from || to ? { from, to } : defaultRange();
    const match = buildMatch({ ...range, state, type });

    const data = await Registration.aggregate([
      { $match: match },
      { $group: { _id: "$manufacturer", total: { $sum: "$count" } } },
      { $project: { _id: 0, manufacturer: "$_id", total: 1 } },
      { $sort: { total: -1 } },
      { $limit: limit }
    ]);
    res.json({ filters: { ...req.query, from: range.from, to: range.to }, data });
  } catch (err) { next(err); }
}

export async function yoy(req, res, next) {
  try {
    const { state, type, manufacturer } = req.query;
    const baseDate = parseDateOrDefault(req.query.date) || new Date();
    const { from, to } = monthRangeFor(baseDate);
    const { from: lyFrom, to: lyTo } = sameRangeLastYear(from, to);

    const matchCur = buildMatch({ from, to, state, type, manufacturer });
    const matchPrev = buildMatch({ from: lyFrom, to: lyTo, state, type, manufacturer });

    const agg = async (match) => {
      const [r] = await Registration.aggregate([
        { $match: match },
        { $group: { _id: null, total: { $sum: "$count" } } }
      ]);
      return r?.total || 0;
    };

    const cur = await agg(matchCur);
    const prev = await agg(matchPrev);
    const growth = prev === 0 ? null : ((cur - prev) / prev) * 100;

    res.json({
      filters: { state, type, manufacturer, from, to, compareFrom: lyFrom, compareTo: lyTo },
      current: cur, previous: prev, yoyPercent: growth
    });
  } catch (err) { next(err); }
}

export async function qoq(req, res, next) {
  try {
    const { state, type, manufacturer } = req.query;
    const baseDate = parseDateOrDefault(req.query.date) || new Date();
    const { from, to, quarter, year } = quarterRangeFor(baseDate);
    const { from: pf, to: pt, quarter: pQuarter, year: pYear } = previousQuarterRange(baseDate);

    const matchCur = buildMatch({ from, to, state, type, manufacturer });
    const matchPrev = buildMatch({ from: pf, to: pt, state, type, manufacturer });

    const agg = async (match) => {
      const [r] = await Registration.aggregate([
        { $match: match },
        { $group: { _id: null, total: { $sum: "$count" } } }
      ]);
      return r?.total || 0;
    };

    const cur = await agg(matchCur);
    const prev = await agg(matchPrev);
    const growth = prev === 0 ? null : ((cur - prev) / prev) * 100;

    res.json({
      filters: { state, type, manufacturer, from, to, quarter, year, compareFrom: pf, compareTo: pt, compareQuarter: pQuarter, compareYear: pYear },
      current: cur, previous: prev, qoqPercent: growth
    });
  } catch (err) { next(err); }
}
