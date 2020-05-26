interface Options {
    header: boolean;
    [key: string]: any;
}
declare function csv2json(sourcePath: string, targetPath: string, options?: Options): Promise<unknown>;
declare namespace csv2json {
    var inline: typeof csv2inlineJson;
}
declare function csv2inlineJson(sourcePath: string, options?: Options): Promise<unknown>;
export default csv2json;
