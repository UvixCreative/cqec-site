import lume from "lume/mod.ts";
import blog from "blog/mod.ts";
import googleFonts from "lume/plugins/google_fonts.ts";

const site = lume();

site.use(blog());
site.use(googleFonts({
  fonts:
    "https://fonts.googleapis.com/css2?family=Playfair:ital,opsz,wght@0,5..1200,300..900;1,5..1200,300..900&family=Yeseva+One&display=swap",
}));
site.copy("/assets");

export default site;
