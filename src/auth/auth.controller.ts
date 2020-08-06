import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

import User from '../user/user.entity';
import { AuthService, SupportedServices } from './auth.service';
import { GetUser } from './get-user.decorator';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { DiscordGuard } from './guards/discord.guard';
import { FaceitGuard } from './guards/faceit.guard';
import { LoginGuard } from './guards/login.guard';
import hasuraAuthDto from './hasuraAuth.dto';
import { ISessionInterface } from './session.interface';

/**
 * Web controller for Authentication
 */
@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  /**
   * Inject dependencies
   * @param authService
   */
  constructor(private authService: AuthService) {}

  @Get("/logout")
  logout(@Req() req): string {
    req.session.destroy();
    return "Logged out";
  }

  @UseGuards(LoginGuard)
  @Get("/steam")
  steam(): Promise<string> {
    return;
  }

  @ApiExcludeEndpoint()
  @UseGuards(LoginGuard)
  @Get("/steam/return")
  steamReturn(@Req() req: Request, @Res() res: Response): void {
    const graphQLkey = this.authService.getGraphQLAuthKey(
      req.session.passport.user
    );
    req.session.apiKey = graphQLkey;
    if (req.session.redirectTo) {
      return res.redirect(req.session.redirectTo);
    } else {
      return res.redirect("/");
    }
  }

  @UseGuards(DiscordGuard)
  @Get("/discord")
  discord(): Promise<string> {
    return;
  }

  @ApiExcludeEndpoint()
  @UseGuards(DiscordGuard)
  @Get("/discord/return")
  discordReturn(@Req() req: Request, @Res() res: Response): void {
    if (req.session.redirectTo) {
      return res.redirect(req.session.redirectTo);
    } else {
      return res.redirect("/");
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get("/discord/disconnect")
  async discordDisconnect(
    @Req() req: Request,
    @GetUser() user: User
  ): Promise<void> {
    delete req.session.passport.user.discordId;
    await this.authService.disconnectService(user, SupportedServices.discord);
    return;
  }

  @UseGuards(FaceitGuard)
  @Get("/faceit")
  faceit(): Promise<string> {
    return;
  }

  @ApiExcludeEndpoint()
  @UseGuards(FaceitGuard)
  @Get("/faceit/return")
  faceitReturn(@Req() req: Request, @Res() res: Response): void {
    if (req.session.redirectTo) {
      return res.redirect(req.session.redirectTo);
    } else {
      return res.redirect("/");
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get("/faceit/disconnect")
  async faceitDisconnect(
    @Req() req: Request,
    @GetUser() user: User
  ): Promise<void> {
    delete req.session.passport.user.faceitId;
    await this.authService.disconnectService(user, SupportedServices.faceit);
    return;
  }

  /**
   * Authentication webhook for Hasura
   * @param body
   */
  @Post("/graphql")
  @HttpCode(200)
  @ApiUnauthorizedResponse({ description: "Invalid JWT provided in header" })
  async graphQL(
    @Body() body: hasuraAuthDto
  ): Promise<{ "X-Hasura-User-Id": string; "X-Hasura-Role": string }> {
    const anonymousResponse = {
      "X-Hasura-User-Id": null,
      "X-Hasura-Role": "anonymous"
    };
    const graphQLkey = body.headers["bantr-graphql"];

    if (!graphQLkey) {
      return anonymousResponse;
    }

    let isValid;
    try {
      isValid = await this.authService.validateGraphQLKey(graphQLkey);
    } catch (error) {
      throw new UnauthorizedException();
    }

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return {
      "X-Hasura-User-Id": `${isValid.id}`,
      "X-Hasura-Role": "user"
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get("/session")
  session(@Req() req: Request): ISessionInterface {
    return req.session.passport.user;
  }
}
