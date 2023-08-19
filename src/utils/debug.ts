import Debug from "debug";

const loggers: Record<string, Debug.Debugger> = {};

export const debug = (scope: string): Debug.Debugger => {
	const logger = loggers[scope];
	if (!logger) loggers[scope] = Debug(`musicstore:${scope}`);
	return loggers[scope];
};

export default debug;
