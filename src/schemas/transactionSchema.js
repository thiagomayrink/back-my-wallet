import joi from 'joi';

export const transactionSchema = joi.object({
    type: joi.number().valid(0).valid(1),
    amount: joi.number().integer().min(1).required(),
    description: joi.string().allow(''),
});
