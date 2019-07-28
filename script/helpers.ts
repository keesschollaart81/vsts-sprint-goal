export class Helpers {

    public getConfigKey = (iterationId: string, teamId: string) => {
        // https://github.com/Microsoft/vss-web-extension-sdk/issues/75
        return iterationId.toString().substring(0, 15) + teamId.toString().substring(0, 15)
    }
}