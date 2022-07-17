import express from "express";
import { router } from "./routes.js"

class listener {
    app = express();
    
    constructor(port: string | undefined) {
        this.port = port;
    }

    init() {
        this.app.use(router);
        this.app.use((req, res) => { res.status(404) })

        // Start the server
        this.app.listen(this.port, () => {
            console.log(`Server started at http://localhost:${this.port}.`);
        });
    }

    //Type Definitions
    port: string | undefined;
};

export { listener };