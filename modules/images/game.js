import Jimp from "jimp";
import promisify from "smart-promisify";

function truncate(input, number) {
  if (input.length > number) {
     return input.substring(0, number) + '...';
  }
  return input;
};

class TextToPicture {
  static async convert({
    scheme,
    ext = 'jpeg',
    quality = 100
  }) {
    let image;

    switch (scheme.name.toLowerCase()) {
      case 'xmerghani':
          image = await Jimp.read("https://cdn.beyondlabs.pl/yfl/game_change/xmerghani.png");
          break;
      case 'youngmulti':
          image = await Jimp.read("https://cdn.beyondlabs.pl/yfl/game_change/youngmulti.png");
          break;
      case 'mrdzinold':
          image = await Jimp.read("https://cdn.beyondlabs.pl/yfl/game_change/mrdzinold.png");
          break;
      case 'banduracartel':
          image = await Jimp.read("https://cdn.beyondlabs.pl/yfl/game_change/banduracartel.png");
          break;
      case 'mork':
          image = await Jimp.read("https://cdn.beyondlabs.pl/yfl/game_change/mork.png");
          break;
      case 'xkaleson':
          image = await Jimp.read("https://cdn.beyondlabs.pl/yfl/game_change/xkaleson.png");
          break;
      default:
          image = await Jimp.read("https://cdn.beyondlabs.pl/yfl/game_change/undefined.png");
    }

    let font;
    let secondFont;
    let thirdFont;

    font = await Jimp.loadFont("fonts/0FTKdU2cb3qP3ZsBvEWS3zVb.ttf.fnt")
    secondFont = await Jimp.loadFont("fonts/uUzvMrHiQoywO83DshfR5Luu.ttf.fnt")
    thirdFont = await Jimp.loadFont("fonts/fDGk4QE_hSBPjZACtzFXZojU.ttf.fnt")

    image.print(font, 131, 92, truncate(scheme.game, '27'), 500, Jimp.ALIGN_FONT_CENTER)

    image.print(secondFont, 60, 173, scheme.viewer, 150, Jimp.ALIGN_FONT_CENTER)

    image.print(thirdFont, 60, 224, scheme.title, 500, Jimp.ALIGN_FONT_CENTER)

    image.quality(quality)

    return {
      image,
      async getBase64() {
        const getBase64 = promisify(image.getBase64)
        return await getBase64.call(image, 'image/' + ext)
      }
    }
  }

  static get Jimp() {
    return Jimp
  }
}
export default TextToPicture;