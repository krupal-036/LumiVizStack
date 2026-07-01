import { NextFunction, Response } from 'express';
import {
    getHistoriesByField,
    getHistoryByField,
} from '../../repositories/history.repo';

export const validateHistory = async (
    req: any,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { title, data, rawInput } = req.body;
        const userId = req.user.id;

        if (rawInput) {
            const rawLines = rawInput.trim().split('\n').length;
            if (rawLines > 500) {
                return res.status(400).json({
                    message: `Input text is too long (${rawLines} lines). Max 500.`,
                });
            }
        }

        if (data) {
            const dataLines = JSON.stringify(data, null, 2).split('\n').length;
            if (dataLines > 500) {
                return res.status(400).json({
                    message: `JSON data structure is too large (${dataLines} lines). Max 500.`,
                });
            }
        }

        if (title) {
            const existingTitle = await getHistoryByField({
                userId,
                title: title.trim(),
            });

            if (existingTitle) {
                return res.status(400).json({
                    message:
                        'You already have a visualization with this title. Please choose a unique name.',
                });
            }
        }

        if (data) {
            const duplicate = await getHistoryByField({
                userId,
                data: data,
            });
            if (duplicate) {
                return res.status(400).json({
                    message:
                        'A visualization with this exact data already exists in your history.',
                });
            }
        }

        const trimmedInput = rawInput?.trim();
        if (trimmedInput) {
            let normalizedInput;
            try {
                normalizedInput = JSON.stringify(JSON.parse(trimmedInput));
            } catch (e) {
                normalizedInput = trimmedInput.trim();
            }

            const histories = await getHistoriesByField({
                userId,
                isDeleted: false,
            });
            const isDuplicate = histories.some((h) => {
                try {
                    const storedNorm = h.rawInput
                        ? JSON.stringify(JSON.parse(h.rawInput))
                        : h.rawInput;
                    return storedNorm === normalizedInput;
                } catch (e) {
                    return h.rawInput === trimmedInput;
                }
            });

            if (isDuplicate) {
                return res.status(400).json({
                    message:
                        'A visualization with this exact data input already exists.',
                });
            }
        }

        if (trimmedInput) {
            const duplicate = await getHistoryByField({
                userId,
                rawInput: trimmedInput,
            });
            if (duplicate) {
                return res.status(400).json({
                    message:
                        'A visualization with this exact data already exists in your history.',
                });
            }
        }

        req.trimmedInput = trimmedInput;

        next();
    } catch (err) {
        return res
            .status(500)
            .json({
                message: 'Server validation failed during validate history',
            });
    }
};
