const { app } = require("electron");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const os = require("os");
const { execSync } = require("child_process");

const MASTER_PASSWORD = "CAMP-APP-2026";

// Rastgele uzun bir secret yaz
const HMAC_SECRET = "campflow-secret-v1-x91Aq";

function getLicensePath() {
    return path.join(
        app.getPath("userData"),
        ".license.dat"
    );
}

function getMachineFingerprint() {

    const parts = [];

    try {

        if (process.platform === "win32") {

            const out = execSync(
                'reg query "HKLM\\SOFTWARE\\Microsoft\\Cryptography" /v MachineGuid',
                {
                    encoding: "utf8",
                    windowsHide: true
                }
            );

            const match = out.match(
                /MachineGuid\s+REG_SZ\s+([A-F0-9-]+)/i
            );

            if (match?.[1]) {

                parts.push(
                    "guid:" + match[1].trim()
                );
            }
        }

    } catch (e) { }

    try {

        parts.push(
            "host:" + os.hostname()
        );

    } catch (e) { }

    try {

        const nets = os.networkInterfaces();

        for (const name of Object.keys(nets)) {

            for (const iface of nets[name]) {

                if (
                    !iface.internal &&
                    iface.mac &&
                    iface.mac !==
                    "00:00:00:00:00:00"
                ) {

                    parts.push(
                        "mac:" + iface.mac
                    );

                    break;
                }
            }
        }

    } catch (e) { }

    try {

        if (process.platform === "win32") {

            const disk = execSync(
                "wmic diskdrive get serialnumber",
                {
                    encoding: "utf8",
                    windowsHide: true
                }
            );

            const serial = disk
                .replace(/SerialNumber/i, "")
                .replace(/\s+/g, "")
                .trim();

            if (serial) {

                parts.push(
                    "disk:" + serial
                );
            }
        }

    } catch (e) { }

    const raw = parts.join("|");

    return crypto
        .createHash("sha256")
        .update(raw)
        .digest("hex");
}

function signFingerprint(fp) {

    return crypto
        .createHmac(
            "sha256",
            HMAC_SECRET
        )
        .update(fp)
        .digest("hex");
}

function isActivated() {

    try {

        const p =
            getLicensePath();

        if (!fs.existsSync(p)) {
            return false;
        }

        const raw =
            fs.readFileSync(
                p,
                "utf8"
            );

        const decoded = Buffer
            .from(raw, "base64")
            .toString("utf8");

        const data =
            JSON.parse(decoded);

        if (
            !data.fingerprint ||
            !data.signature
        ) {
            return false;
        }

        const expectedSig =
            signFingerprint(
                data.fingerprint
            );

        if (
            data.signature !==
            expectedSig
        ) {

            return false;
        }

        const currentFp = getMachineFingerprint();

        if (
            currentFp !==
            data.fingerprint
        ) {

            return false;
        }

        return true;

    } catch (e) {

        return false;
    }
}

function activate(passwordAttempt) {

    try {
        if (isActivated()) {

            return {
                success: false,
                error: "Uygulama zaten aktive edilmiş."
            };
        }

        if (
            passwordAttempt !== MASTER_PASSWORD
        ) {

            return {
                success: false,
                error: "Aktivasyon şifresi hatalı."
            };
        }

        const fp = getMachineFingerprint();

        const payload = {

            fingerprint: fp,

            signature: signFingerprint(fp),

            activatedAt: new Date().toISOString()
        };

        const encoded = Buffer
            .from(
                JSON.stringify(payload)
            )
            .toString("base64");

        const p = getLicensePath();

        fs.mkdirSync(
            path.dirname(p),
            { recursive: true }
        );

        fs.writeFileSync(
            p,
            encoded,
            "utf8"
        );

        return {
            success: true
        };

    } catch (e) {

        return {
            success: false,
            error: "Aktivasyon başarısız: " + e.message
        };
    }
}

module.exports = {
    activate,
    isActivated,
    getMachineFingerprint
};