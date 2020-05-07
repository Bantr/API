import { IsArray, IsBoolean, IsNumber } from 'class-validator';

export class SetSeenDto {
    @IsBoolean()
    status = true;
    @IsArray()
    @IsNumber({}, { each: true })
    ids: string[];
}