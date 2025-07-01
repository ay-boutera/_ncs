import { PartialType } from "@nestjs/mapped-types"
import { CreateCollectionPointDto } from "./create-collection-point.dto";

export class UpdateCollectionPointDto extends PartialType(CreateCollectionPointDto) {} 