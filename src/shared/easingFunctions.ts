export class Easing {

    static easeLinear(x: number): number {
        return x
    }

    static easeInQuad(x: number) {
        return x * x
    }

    static inverseEaseInQuad(x: number) {
        return Math.sqrt(x)
    }

    static easeInCubic(x: number) {
        return x * x * x
    }

    static inverseEaseInCubic(x: number) {
        return Math.pow(x, 1 / 3)
    }

    static getEasingByType(type: EasingType) {
        switch (type) {
            case EasingType.LINEAR:
                return Easing.easeLinear
            case EasingType.IN_QUAD:
                return Easing.easeInQuad
            case EasingType.IN_CUBIC:
                return Easing.easeInCubic
            default:
                return Easing.easeLinear
        }
    }

    static getInverseEasingByType(type: EasingType) {
        switch (type) {
            case EasingType.LINEAR:
                return Easing.easeLinear
            case EasingType.IN_QUAD:
                return Easing.inverseEaseInQuad
            case EasingType.IN_CUBIC:
                return Easing.inverseEaseInCubic
            default:
                return Easing.easeLinear
        }
    }

}

export enum EasingType {
    LINEAR,
    IN_QUAD,
    IN_CUBIC
}