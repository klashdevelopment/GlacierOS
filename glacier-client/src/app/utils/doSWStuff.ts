declare const search: any;
declare const __uv$config: any;
declare const registerSW: any;
declare const setTransport: any;
export async function registerSWandset(onceDone: (defined: boolean) => void) {
    var errmsg = "";
    var err2msg = "";
    try {
        await registerSW();
        console.log("[REGISTERSWANDSET] registerSW success");
    } catch (err) {
        console.log("[REGISTERSWANDSET] registerSW fail");
        errmsg = (err as Error).message;
    }

    try {
        await setTransport("epoxy");
        console.log("[REGISTERSWANDSET] transport success");
    } catch (err2) {
        console.log("[REGISTERSWANDSET] transport fail");
        err2msg = (err2 as Error).message;
    }
    
    if (errmsg.includes("registerSW is not defined") || err2msg.includes("setTransport is not defined")) {
        onceDone(false);
        return;
    }

    async function waitForConfig() {
        return new Promise((resolve: (value?: unknown) => void) => {
            const interval = setInterval(() => {
                if (__uv$config !== null && __uv$config !== undefined) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100); // Check every 100 milliseconds
        });
    }

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    await waitForConfig();
    await delay(500);
    onceDone(true);
}