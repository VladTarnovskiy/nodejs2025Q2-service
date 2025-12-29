import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IUpdatePasswordDto {
  @ApiProperty({
    description: "The user's old password",
    example: 'oldPassword123',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string; // previous password

  @ApiProperty({
    description: "The user's new password",
    example: 'newPassword123',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string; // new password
}
