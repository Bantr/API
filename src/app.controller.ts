import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Response } from 'express';

/**
 * General app controller
 */
@Controller()
export class AppController {

  @ApiExcludeEndpoint()
  @Get('/')
  root(@Res() res: Response): void {
    return res.redirect('/api');
  }
}
