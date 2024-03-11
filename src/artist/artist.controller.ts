import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Artist, ArtistService } from './artist.service';
import { validate } from 'uuid';
import { Response } from 'express';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  getAll(): Artist[] {
    return this.artistService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string, @Res() res: Response) {
    // TODO: Refactor repeated checks
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid artist ID.');
      return;
    }

    const artist = this.artistService.getById(id);

    if (!artist) {
      res.status(HttpStatus.NOT_FOUND).send('Artist not found.');
      return;
    }

    res.status(HttpStatus.OK).send(artist);
  }

  @Post()
  createArtist(@Body() dto: CreateArtistDto, @Res() res: Response) {
    if (!dto.name || !dto.grammy) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send('Required fields are not provided.');
      return;
    }

    const newArtist = this.artistService.createArtist(dto);

    res.status(HttpStatus.CREATED).send(newArtist);
  }

  @Put(':id')
  updateArtist(
    @Body() dto: UpdateArtistDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid artist ID.');
      return;
    }

    const artist = this.artistService.getById(id);
    if (!artist) {
      res.status(HttpStatus.NOT_FOUND).send('Artist not found.');
      return;
    }

    const updatedArtist = this.artistService.updateArtist(dto, id);

    res.status(HttpStatus.OK).send(updatedArtist);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST).send('Not valid artist ID.');
      return;
    }

    this.artistService.deleteArtist(id)
      ? res.status(HttpStatus.NO_CONTENT).send()
      : res.status(HttpStatus.NOT_FOUND).send('Artist not found.');
  }
}
