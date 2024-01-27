export class Easing {

    static easeLinear(x: number): number {
        return x;
    }

    static easeInQuad(x: number) {
        return x  * x;
    }

    static inverseEaseInQuad(x: number) {
        return Math.sqrt(x);
    }

    static getEasingByType(type: EasingType) {
        switch(type){
            case EasingType.LINEAR:
                return Easing.easeLinear;
            case EasingType.IN_QUAD:
                return Easing.easeInQuad;
            default:
                return Easing.easeLinear;
        }
    }

    static getInverseEasingByType(type: EasingType) {
        switch(type){
            case EasingType.LINEAR:
                return Easing.easeLinear;
            case EasingType.IN_QUAD:
                return Easing.inverseEaseInQuad;
            default:
                return Easing.easeLinear;
        }
    }

}

export enum EasingType {
    LINEAR,
    IN_QUAD
}