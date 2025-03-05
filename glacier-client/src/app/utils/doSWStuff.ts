declare const search: any;
declare const __uv$config: any;
declare const registerSW: any;
declare const setTransport: any;
export async function registerSWandset(onceDone: (defined: boolean) => void) {
    
    // if (/*errmsg.includes("registerSW is not defined") || err2msg.includes("setTransport is not defined")*/ window.location.href.includes('github.dev')) {
    //     onceDone(false);
    //     return;
    // }
    try{ if(__uv$config === undefined) {} } catch(e) { onceDone(false); return; }

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