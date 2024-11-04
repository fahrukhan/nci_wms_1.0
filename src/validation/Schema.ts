type ValidationFunction<T> = (value: T) => boolean;
type ValidationsList<T> =Array<{ name: keyof T, fn: ValidationFunction<T> }>;


export class ValidationSchema<T> {
    private validations:ValidationsList<T> ;

    constructor(validations?:ValidationsList<T>) {
        this.validations = validations ?? [];
    }

    addValidation(name: keyof T, fn: ValidationFunction<T>) {
        this.validations.push({ name, fn });
    }

    validate(values: T): Array<string> {
        const errors: Array<string> = [];
        
        for (const validation of this.validations) {
        if (!validation.fn(values)) {
            errors.push(`Invalid value in property :${String(validation.name)}`);
        }
        }

        return errors;
    }
}