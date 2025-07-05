import { Config } from "../../../data/models/paymentConfig.js";
import HttpText from "../../../utils/HttpText.js";
import asyncErrorHandler from "../../middlewares/asyncErrorHandler.js";

const setConfig = asyncErrorHandler(
    async (req, res) => {
        const { hourRate, term } = req.body;
        
        let config = await Config.findOne();

        if (config) {
            config.hourRate = hourRate;
            config.term = term;
            await config.save();
        } else {
            config = await Config.create({ hourRate, term });
        }

        res.status(200).json({
            success: HttpText.SUCCESS,
            data: config
        });
    }
);

const getConfig = asyncErrorHandler(
    async (req, res) => {
        const config = await Config.findOne();

        if (!config) {
            return res.status(200).json({
                status: HttpText.SUCCESS,
                data: null
            });
        }

        res.status(200).json({
            success: HttpText.SUCCESS,
            data: config
        });
    }
);

export default {
    setConfig,
    getConfig,
}