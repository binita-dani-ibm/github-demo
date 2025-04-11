import Joi from "joi";

export const objectSchema = (obj: any) => Joi.object(obj);
export const arrItemSchema = (obj: any) => Joi.array().items(obj);
export const arrItemReqSchema = (obj: any) => Joi.array().required().items(obj);

export const _stringSchema = Joi.string();
export const _numSchema = Joi.number();
export const _boolSchema = Joi.boolean();
export const _isoDateSchema = Joi.string().isoDate();

export const _stringReqSchema = _stringSchema.required();
export const _numReqSchema = _numSchema.required();
export const _boolReqSchema = _boolSchema.required();
export const _isoDateReqSchema = _isoDateSchema.required();

export const _integerSchema = _numSchema.integer();
export const _alphaNumSchema = _stringSchema.alphanum();
export const _nameSchema = _alphaNumSchema.min(2).max(30);
export const _emailSchema = _stringSchema.email();
export const _tokenSchema = _stringSchema.token().length(32).required()
    .error(() => 'Invalid token');

export const _stateOptSchema = _stringSchema.valid('open', 'closed', 'all').optional();
export const _stringOptSchema = _stringSchema.optional();
export const _boolOptSchema = _boolSchema.optional();
export const _boolNullSchema = _boolSchema.allow(null);
export const _numOptSchema = _numSchema.optional();
export const _stringNullSchema = _stringSchema.allow(null);
export const _sortOptSchema =  _stringSchema.valid('created', 'updated', 'popularity', 'long-running').optional();
export const _headOptSchema= _stringSchema.pattern(/^([\w-]+):([\w-]+)$/).optional();
export const _perPageOptSchema = _integerSchema.max(100).optional();
export const _integerOptSchema = _integerSchema.optional();
export const _directionOptSchema = _stringSchema.valid('asc', 'desc').optional();