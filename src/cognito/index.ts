import { getTokenFromHostedUI } from "./hosteduibased";

const getToken = (setup: any): Promise<string> => getTokenFromHostedUI(setup);

export { getToken };
