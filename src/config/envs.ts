import 'dotenv/config';
import * as joi from 'joi';

// interface type data variables
interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
}

// schema validation
const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

// validation schema
const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(
    `Configuration validation variable enviroment error: ${error.message}`,
  );
}

// assign values validate in EnvVars
const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
};
