// frontend/src/utils/dataParser.ts

export const isImageUrl = (url: unknown): boolean => {
    if (typeof url !== "string") return false;
    return (
        url.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i) != null ||
        url.includes("unsplash.com") ||
        url.includes("picsum.photos") ||
        url.includes("googleusercontent.com")
    );
};

export const isUrl = (val: unknown): boolean => {
    if (typeof val !== "string") return false;
    return val.startsWith("http://") || val.startsWith("https://");
};

export interface ParsedDataResult {
    // Array projected for Tabular, Card, and Recharts rendering
    tabularData: Array<Record<string, any>>;
    // Complete intact object/array for GraphView & Monaco TreeView
    hierarchicalData: any;
    // Metadata describing the structure
    isProjectedObject: boolean;
    totalRecords: number;
}

/**
 * Transforms non-tabular dictionaries (like package.json, configs, or stats objects)
 * into a structured array of records for Table, Card, and Chart visualizers.
 */
const projectDictionaryToTable = (obj: Record<string, any>): Array<Record<string, any>> => {
    const rows: Array<Record<string, any>> = [];

    for (const [key, value] of Object.entries(obj)) {
        if (value !== null && typeof value === "object" && !Array.isArray(value)) {
            // Sub-dictionary (e.g., dependencies: { react: "^19.0.0", vite: "^6.0.0" })
            const subEntries = Object.entries(value);
            if (subEntries.length > 0) {
                subEntries.forEach(([subKey, subVal], index) => {
                    rows.push({
                        id: `${key}_${index + 1}`,
                        category: key,
                        property: subKey,
                        value: typeof subVal === "object" ? JSON.stringify(subVal) : subVal,
                        count: typeof subVal === "number" ? subVal : 1,
                    });
                });
                continue;
            }
        }

        if (Array.isArray(value)) {
            // Array property (e.g., keywords: ["react", "vite"])
            value.forEach((item, index) => {
                rows.push({
                    id: `${key}_${index + 1}`,
                    category: key,
                    property: String(index),
                    value: typeof item === "object" ? JSON.stringify(item) : item,
                    count: typeof item === "number" ? item : 1,
                });
            });
            continue;
        }

        // Primitive top-level property (name, version, private, etc.)
        rows.push({
            id: key,
            category: "general",
            property: key,
            value: value,
            count: typeof value === "number" ? value : 1,
        });
    }

    return rows.length > 0 ? rows : [obj];
};

/**
 * Universal Dual-Format Parser:
 * Preserves the full hierarchical structure for Graph & Tree explorers,
 * while generating normalized rows for Table, Card, and Recharts displays.
 */
export const parseDualData = (dataString: string | any): ParsedDataResult => {
    try {
        let parsed = dataString;
        if (typeof dataString === "string") {
            const clean = dataString.trim();
            if (!clean) {
                return {
                    tabularData: [],
                    hierarchicalData: null,
                    isProjectedObject: false,
                    totalRecords: 0,
                };
            }
            parsed = JSON.parse(clean);
        }

        if (!parsed || typeof parsed !== "object") {
            return {
                tabularData: [],
                hierarchicalData: parsed,
                isProjectedObject: false,
                totalRecords: 0,
            };
        }

        // 1. Direct Array of Objects (e.g. users: [{...}, {...}])
        if (Array.isArray(parsed)) {
            const tabular = parsed.map((item, idx) => {
                if (item !== null && typeof item === "object") return item;
                return { id: idx + 1, value: item };
            });
            return {
                tabularData: tabular,
                hierarchicalData: parsed,
                isProjectedObject: false,
                totalRecords: tabular.length,
            };
        }

        // 2. Object with a primary record array (e.g. { users: [...], total: 10 })
        // We only extract if the sub-array contains actual row records (objects)
        const recordArrayKey = Object.keys(parsed).find(
            (k) =>
                Array.isArray(parsed[k]) &&
                parsed[k].length > 0 &&
                typeof parsed[k][0] === "object" &&
                parsed[k][0] !== null,
        );

        if (recordArrayKey) {
            return {
                tabularData: parsed[recordArrayKey],
                hierarchicalData: parsed, // Retains full object with metadata
                isProjectedObject: false,
                totalRecords: parsed[recordArrayKey].length,
            };
        }

        // 3. Nested Dictionary / Config Object (e.g., package.json, server configs)
        const projected = projectDictionaryToTable(parsed);
        return {
            tabularData: projected,
            hierarchicalData: parsed, // Pure original object preserved intact
            isProjectedObject: true,
            totalRecords: projected.length,
        };
    } catch {
        throw new Error("Invalid JSON format. Please verify your syntax.");
    }
};

/**
 * Backward compatibility wrapper for existing functions
 */
export const parseData = (dataString: string | any): any[] => {
    const res = parseDualData(dataString);
    return res.tabularData;
};
