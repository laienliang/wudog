from __future__ import annotations

import csv
import io
import json
import os
import re
import shutil
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "wudong-deliverables"
MATERIAL_DIR = OUTPUT_DIR / "商品素材"
BACKEND_IMAGE_DIR = ROOT / "backend" / "public" / "heritage-products"
SQL_OUTPUT = ROOT / "backend" / "sql" / "wudong_products_seed.sql"
INIT_SQL = ROOT / "backend" / "sql" / "init.sql"
JSON_OUTPUT = OUTPUT_DIR / "wudong_products_payload.json"
SOURCE_MANIFEST = OUTPUT_DIR / "image_sources.csv"
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/126.0.0.0 Safari/537.36"
)
BACKEND_BASE_URL = "http://127.0.0.1:3000"
TIMESTAMP = "2026-06-19 20:00:00"


@dataclass(frozen=True)
class ImageSource:
    label: str
    asset_url: str
    page_url: str
    note: str


@dataclass(frozen=True)
class Product:
    category_name: str
    category_id: int
    product_id: int
    title: str
    slug: str
    subtitle: str
    description: str
    craft_intro: str
    inheritor_name: str
    inheritor_intro: str
    sku_name: str
    specs: str
    sale_price: int
    original_price: int
    stock: int
    sources: tuple[ImageSource, ...]


PRODUCTS: tuple[Product, ...] = (
    Product(
        category_name="刺绣服饰",
        category_id=1,
        product_id=101,
        title="苗绣外套",
        slug="miaoxiu-jacket",
        subtitle="立体针法勾出山花纹样的短款外套",
        description="以黑底面料承托彩线苗绣，版型利落好搭配，适合通勤、展演和节庆穿着，能一眼看出手工纹样的层次感。",
        craft_intro="苗绣外套通常以棉麻或混纺底布作胎，先完成裁片定位，再用锁绣、平绣和贴布绣逐层叠加纹样。常见图案会借用山花、鸟羽、旋涡和藤蔓来表达吉祥寓意，针脚细密时能形成浮雕般的立体效果。成衣收尾前还要反复压整边线，保证袖口、门襟和肩部纹样在穿着时保持完整观感。",
        inheritor_name="杨秀兰",
        inheritor_intro="杨秀兰长期在黔东南从事苗绣教学与样衣整理，擅长把传统纹样拆解成适合年轻穿着的服饰版型。她重视针法规范与色线搭配，也常带学生做旧衣再设计，让非遗工艺更贴近日常使用。",
        sku_name="标准款",
        specs="标准款",
        sale_price=299,
        original_price=369,
        stock=28,
        sources=(
            ImageSource(
                label="embroidered_jacket_1",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/6/68/Bethlehem_Jacket_%28taqsireh%29-3.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Bethlehem_Jacket_(taqsireh)-3.jpg",
                note="Wikimedia Commons",
            ),
            ImageSource(
                label="embroidered_jacket_2",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/0/01/Bethlehem_Jacket_%28taqsireh%29-2.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Bethlehem_Jacket_(taqsireh)-2.jpg",
                note="Wikimedia Commons",
            ),
            ImageSource(
                label="embroidered_jacket_3",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/6/6a/Smoking_jacket%2C_Japanese_for_Western_market%2C_quilted_and_embroidered_silk.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Smoking_jacket,_Japanese_for_Western_market,_quilted_and_embroidered_silk.jpg",
                note="Wikimedia Commons",
            ),
        ),
    ),
    Product(
        category_name="刺绣服饰",
        category_id=1,
        product_id=102,
        title="苗绣披肩",
        slug="miaoxiu-shawl",
        subtitle="花卉纹样铺展肩面的轻暖手工披肩",
        description="披肩以大面积绣花纹样呈现层次，披搭时能自然垂坠，既适合作为舞台点缀，也适合秋冬日常叠穿提升整体气质。",
        craft_intro="刺绣披肩的制作重点在于大幅面构图和边缘收整。工匠先根据披肩长度排布主纹和辅纹，再以分段绣制的方式控制针脚疏密，避免布面过重。为了让披肩在披搭时更有流动感，边缘常用包边或暗缝固定，局部再加入流苏、滚边或压纹，让整件作品在展开和平铺时都保有完整装饰性。",
        inheritor_name="石月芬",
        inheritor_intro="石月芬主做民族服饰与披肩绣品，熟悉大幅面绣片的构图节奏。她强调先定主纹再补细节的制作流程，作品常被用于节庆服饰和文创展示，也会带学员练习边角包缝和绣片整烫。",
        sku_name="标准款",
        specs="标准款",
        sale_price=239,
        original_price=299,
        stock=35,
        sources=(
            ImageSource(
                label="embroidered_shawl_1",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/3/34/Embroidery_on_a_cashmere_shawl_01.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Embroidery_on_a_cashmere_shawl_01.jpg",
                note="Wikimedia Commons",
            ),
            ImageSource(
                label="embroidered_shawl_2",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/1/1f/Embroidery_on_a_cashmere_shawl_08.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Embroidery_on_a_cashmere_shawl_08.jpg",
                note="Wikimedia Commons",
            ),
            ImageSource(
                label="embroidered_shawl_3",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/9/9c/Embroidery_on_a_cashmere_shawl_09.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Embroidery_on_a_cashmere_shawl_09.jpg",
                note="Wikimedia Commons",
            ),
        ),
    ),
    Product(
        category_name="扎染服饰",
        category_id=2,
        product_id=103,
        title="扎染连衣裙",
        slug="zharan-dress",
        subtitle="蓝白晕染层层铺开的夏日感连衣裙",
        description="以蓝白渐变扎染做视觉主调，裙身轻盈、图案不死板，适合拍照、出游与轻社交场景，既醒目又保留手作温度。",
        craft_intro="扎染连衣裙的关键在于绑扎分区与上染节奏。面料会先预洗定型，再按裙片结构做折叠、缠线或夹板固定，让染液在松紧交界处自然形成晕染边界。多次浸染能让蓝白过渡更丰富，但每次都要控制停留时间和清洗顺序，避免色层浑浊。成衣拼接后还需再次整烫，保证纹样在裙身前后保持连贯。",
        inheritor_name="李青禾",
        inheritor_intro="李青禾专注蓝染与扎染服饰开发，擅长把传统扎结方式转化成更适合连衣裙的纹样节奏。她重视色差控制和布料回缩率，经常带团队反复试版，让每件成衣都保留自然却不凌乱的染色层次。",
        sku_name="M码",
        specs="M码",
        sale_price=329,
        original_price=399,
        stock=22,
        sources=(
            ImageSource(
                label="batik_dress_1",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/5/5d/Issey_Miyake%2C_Summer_1984_-_Indigo_Batik_Dress_01.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Issey_Miyake,_Summer_1984_-_Indigo_Batik_Dress_01.jpg",
                note="Wikimedia Commons",
            ),
            ImageSource(
                label="batik_dress_2",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/3/30/Issey_Miyake%2C_Summer_1984_-_Indigo_Batik_Dress_02.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Issey_Miyake,_Summer_1984_-_Indigo_Batik_Dress_02.jpg",
                note="Wikimedia Commons",
            ),
            ImageSource(
                label="batik_dress_3",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/d/df/Issey_Miyake%2C_Summer_1984_-_Indigo_Batik_Dress_03.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Issey_Miyake,_Summer_1984_-_Indigo_Batik_Dress_03.jpg",
                note="Wikimedia Commons",
            ),
        ),
    ),
    Product(
        category_name="扎染服饰",
        category_id=2,
        product_id=104,
        title="扎染围巾",
        slug="zharan-scarf",
        subtitle="蓝靛过渡自然的轻薄围巾与披搭单品",
        description="围巾色彩从深靛到浅白逐步过渡，卷绕佩戴或平铺拍摄都很好看，适合春秋通勤、旅行搭配和文创礼赠场景。",
        craft_intro="扎染围巾比成衣更考验布面的染色均匀度。工匠会先根据围巾长度安排留白和深染区域，再通过卷扎、拧扎或折叠夹扎形成重复节奏。为了保留轻薄手感，染后清洗与晾晒必须更温和，既要把浮色洗净，又不能让纤维板结。最终成品通常还会进行软整处理，让围巾在系绕时更服帖。",
        inheritor_name="周染宁",
        inheritor_intro="周染宁长期从事蓝染围巾和家居布艺制作，熟悉轻薄棉麻面料的扎染控制。她尤其看重颜色层次和边缘留白，经常用不同扎法做小样比较，再确定量产图案，保证每条围巾都带有稳定的手工辨识度。",
        sku_name="标准款",
        specs="标准款",
        sale_price=119,
        original_price=169,
        stock=54,
        sources=(
            ImageSource(
                label="tie_dye_scarf_1",
                asset_url="https://images.meesho.com/images/products/348640936/peq8r_512.jpg",
                page_url="https://www.meesho.com/cotton-shibori-tie-and-dye-dupattastole-scarf-for-girls-and-women/p/5rj1q4",
                note="Meesho product page",
            ),
            ImageSource(
                label="tie_dye_scarf_2",
                asset_url="https://images.meesho.com/images/products/348640936/peq8r_512.jpg",
                page_url="https://www.meesho.com/cotton-shibori-tie-and-dye-dupattastole-scarf-for-girls-and-women/p/5rj1q4",
                note="Meesho product page duplicate source used for detail crops",
            ),
            ImageSource(
                label="tie_dye_scarf_3",
                asset_url="https://images.meesho.com/images/products/348640936/peq8r_512.jpg",
                page_url="https://www.meesho.com/cotton-shibori-tie-and-dye-dupattastole-scarf-for-girls-and-women/p/5rj1q4",
                note="Meesho product page duplicate source used for detail crops",
            ),
        ),
    ),
    Product(
        category_name="刺绣服饰",
        category_id=1,
        product_id=105,
        title="盘扣上衣",
        slug="pankou-top",
        subtitle="斜襟盘扣点题的新中式亚麻感上衣",
        description="保留中式斜襟和盘扣细节，版型宽松不挑身形，日常搭配半裙或长裤都很利落，适合新中式穿搭和展示场景。",
        craft_intro="盘扣上衣的制作看似简洁，难点却集中在门襟结构和盘扣成型。布料裁片完成后，要先定位领口、胸襟与扣位，再以包条绕折、压缝和手工定型做出圆润服帖的盘扣。若面料偏软，还需要增加内衬或贴条来保证门襟挺度。最后通过整烫和手缝固定，让盘扣既能实用开合，也能成为整件上衣的视觉焦点。",
        inheritor_name="陈素锦",
        inheritor_intro="陈素锦多年从事中式服装制作，擅长盘扣、斜襟和滚边工艺细节处理。她会把传统成衣结构拆解给学员练习，从一字扣到花型扣逐步进阶，也常参与新中式日常服饰的小批量打样。",
        sku_name="L码",
        specs="L码",
        sale_price=189,
        original_price=249,
        stock=31,
        sources=(
            ImageSource(
                label="frog_button_top_1",
                asset_url="http://minibeestore.com/cdn/shop/files/61zIpsurlaL._AC_SY550.jpg?v=1701414293",
                page_url="https://minibeestore.com/products/womens-linen-retro-chinese-frog-button-tops-blouse",
                note="Minibee product page",
            ),
            ImageSource(
                label="frog_button_top_2",
                asset_url="http://minibeestore.com/cdn/shop/files/61zIpsurlaL._AC_SY550.jpg?v=1701414293",
                page_url="https://minibeestore.com/products/womens-linen-retro-chinese-frog-button-tops-blouse",
                note="Minibee product page duplicate source used for detail crops",
            ),
            ImageSource(
                label="frog_button_top_3",
                asset_url="http://minibeestore.com/cdn/shop/files/61zIpsurlaL._AC_SY550.jpg?v=1701414293",
                page_url="https://minibeestore.com/products/womens-linen-retro-chinese-frog-button-tops-blouse",
                note="Minibee product page duplicate source used for detail crops",
            ),
        ),
    ),
    Product(
        category_name="手工配饰",
        category_id=3,
        product_id=106,
        title="香包挂饰",
        slug="xiangbao-pendant",
        subtitle="可悬挂可收纳香料的刺绣小香包挂饰",
        description="小巧轻便，既能作为包挂和车挂，也适合节庆伴手礼。刺绣纹样清晰，配色温和，兼顾装饰感与传统手作气息。",
        craft_intro="香包挂饰常用小块布料、棉线和填充香料手工制作，步骤虽短，但每个环节都很考验细致度。先裁出正反面形状并完成小面积绣样，再用暗缝或锁边收口，最后加入棉花、艾草或香料碎料，使香包既饱满又不显鼓胀。挂绳和穗子会在收尾阶段一并固定，保证悬挂时重心稳定、不易变形。",
        inheritor_name="吴佩芸",
        inheritor_intro="吴佩芸长期做节令香包和布艺挂件，熟悉小件刺绣、填充和收口技巧。她常把传统纹样与现代配色结合，做出更适合文创礼品的挂饰样式，也会教授学生如何控制香料比例和挂绳牢度。",
        sku_name="标准款",
        specs="标准款",
        sale_price=79,
        original_price=109,
        stock=68,
        sources=(
            ImageSource(
                label="sachet_1",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/7/70/Sachet_%28AM_1999.155.91-8%29.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Sachet_(AM_1999.155.91-8).jpg",
                note="Wikimedia Commons",
            ),
            ImageSource(
                label="sachet_2",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/0/0e/Sachet_%28AM_1966.79-1%29.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Sachet_(AM_1966.79-1).jpg",
                note="Wikimedia Commons",
            ),
            ImageSource(
                label="sachet_3",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/2/21/Sachet_%28AM_1966.79-4%29.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Sachet_(AM_1966.79-4).jpg",
                note="Wikimedia Commons",
            ),
        ),
    ),
    Product(
        category_name="手工配饰",
        category_id=3,
        product_id=107,
        title="绣花手提包",
        slug="xiuhua-handbag",
        subtitle="花枝纹样醒目的复古风绣花手提包",
        description="包身轮廓简洁，绣花细节集中在正面视觉区，既适合日常通勤，也适合作为非遗主题展示和拍照搭配单品。",
        craft_intro="绣花手提包通常先完成包面绣片，再进入衬布复合、袋口加固和提手安装工序。因为包体需要承重，绣样布局不能只追求满绣效果，还要避开受力最重的折角和缝线位置。制作时会通过里布、棉衬和压线稳定包型，使绣面既能保持平整，也不容易因为反复开合而起皱变形。",
        inheritor_name="赵云岚",
        inheritor_intro="赵云岚从事布包和绣片文创开发多年，擅长把传统花鸟纹样缩放到适合包袋正面的视觉比例。她很重视结构耐用性，常把衬布、提手和拉链牢度一起纳入打样标准，兼顾好看和实用。",
        sku_name="标准款",
        specs="标准款",
        sale_price=259,
        original_price=329,
        stock=19,
        sources=(
            ImageSource(
                label="embroidered_bag_1",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/8/88/Tan_Handbag_with_Embroidered_Fruit_Design_-_DPLA_-_be6700d55402f563415b5a5ed9ecac31_%28page_26%29.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Tan_Handbag_with_Embroidered_Fruit_Design_-_DPLA_-_be6700d55402f563415b5a5ed9ecac31_(page_26).jpg",
                note="Wikimedia Commons",
            ),
            ImageSource(
                label="embroidered_bag_2",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/9/9b/Tan_Handbag_with_Embroidered_Fruit_Design_-_DPLA_-_be6700d55402f563415b5a5ed9ecac31_%28page_36%29.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Tan_Handbag_with_Embroidered_Fruit_Design_-_DPLA_-_be6700d55402f563415b5a5ed9ecac31_(page_36).jpg",
                note="Wikimedia Commons",
            ),
            ImageSource(
                label="embroidered_bag_3",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/9/93/Tan_Handbag_with_Embroidered_Fruit_Design_-_DPLA_-_be6700d55402f563415b5a5ed9ecac31_%28page_7%29.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Tan_Handbag_with_Embroidered_Fruit_Design_-_DPLA_-_be6700d55402f563415b5a5ed9ecac31_(page_7).jpg",
                note="Wikimedia Commons",
            ),
        ),
    ),
    Product(
        category_name="手工配饰",
        category_id=3,
        product_id=108,
        title="非遗布艺发饰",
        slug="buyi-hair-accessory",
        subtitle="带刺绣与织带细节的布艺发饰头带",
        description="以布艺包覆发箍或头带结构，佩戴轻便不压头，适合节日造型、汉服新中式搭配和文创礼品场景，辨识度很高。",
        craft_intro="布艺发饰看起来体量小，但很考验包布、定型和缝合精度。制作时要先确定发箍或头带骨架，再根据弧度裁布、覆棉和包边，局部可加入小型绣片、织带或盘花做装饰。因为佩戴会反复弯折，所有接缝都需要额外压线或手缝补强，保证发饰不易起皱、开胶或在头顶部位鼓起。",
        inheritor_name="何雨棠",
        inheritor_intro="何雨棠擅长制作小型布艺配件，尤其重视佩戴舒适度和结构稳定性。她会把传统纹样简化成更适合头饰尺度的小元素，再结合织带和包边工艺，让作品既保有非遗气质，也更适合年轻用户日常搭配。",
        sku_name="标准款",
        specs="标准款",
        sale_price=59,
        original_price=89,
        stock=73,
        sources=(
            ImageSource(
                label="embroidered_headband_1",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/4/4a/Headband_MET_DP17571.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Headband_MET_DP17571.jpg",
                note="Wikimedia Commons",
            ),
            ImageSource(
                label="embroidered_headband_2",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/4/4a/Headband_MET_DP17571.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Headband_MET_DP17571.jpg",
                note="Wikimedia Commons duplicate source used for detail crops",
            ),
            ImageSource(
                label="embroidered_headband_3",
                asset_url="https://upload.wikimedia.org/wikipedia/commons/4/4a/Headband_MET_DP17571.jpg",
                page_url="https://commons.wikimedia.org/wiki/File:Headband_MET_DP17571.jpg",
                note="Wikimedia Commons duplicate source used for detail crops",
            ),
        ),
    ),
)


def clean_output_dirs() -> None:
    for path in (OUTPUT_DIR, BACKEND_IMAGE_DIR):
        if path.exists():
            shutil.rmtree(path)
        path.mkdir(parents=True, exist_ok=True)


def fetch_bytes(url: str, retries: int = 4, pause: float = 1.8) -> bytes:
    last_error: Exception | None = None
    current_url = url
    for attempt in range(retries):
        req = urllib.request.Request(current_url, headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                return response.read()
        except Exception as exc:  # pragma: no cover - network retries
            last_error = exc
            if (
                isinstance(exc, urllib.error.HTTPError)
                and exc.code == 429
                and "upload.wikimedia.org/wikipedia/commons/" in current_url
            ):
                file_name = urllib.parse.unquote(current_url.rsplit("/", 1)[-1])
                current_url = (
                    "https://commons.wikimedia.org/wiki/Special:FilePath/"
                    f"{file_name}?width=1600"
                )
                time.sleep(pause * (attempt + 1))
                continue
            if isinstance(exc, urllib.error.HTTPError) and exc.code == 429:
                time.sleep(pause * (attempt + 1))
                continue
            if attempt < retries - 1:
                time.sleep(pause * (attempt + 1))
    raise RuntimeError(f"failed to fetch {current_url}: {last_error}")


def open_image(data: bytes) -> Image.Image:
    with Image.open(io.BytesIO(data)) as img:
        return img.convert("RGB")


def crop_square(img: Image.Image, box: tuple[int, int, int, int] | None = None) -> Image.Image:
    if box is not None:
        return img.crop(box)
    side = min(img.size)
    left = (img.width - side) // 2
    top = (img.height - side) // 2
    return img.crop((left, top, left + side, top + side))


def make_square_variants(images: list[Image.Image]) -> list[Image.Image]:
    first = images[0]
    variants: list[Image.Image] = []

    # Main image keeps the full subject and pads if needed.
    variants.append(
        ImageOps.pad(first, (1200, 1200), color=(245, 240, 234), centering=(0.5, 0.5))
    )

    if len(images) >= 3:
        details = images[1:3]
        for img in details:
            variants.append(ImageOps.fit(img, (1200, 1200), method=Image.Resampling.LANCZOS))
        return variants

    center = crop_square(first)
    variants.append(
        ImageOps.fit(center, (1200, 1200), method=Image.Resampling.LANCZOS)
    )

    left = 0
    top = 0
    side = min(first.width, first.height)
    if first.width > first.height:
        left = max((first.width - side) // 4, 0)
    else:
        top = max((first.height - side) // 5, 0)
    detail_box = (left, top, left + side, top + side)
    variants.append(
        ImageOps.fit(crop_square(first, detail_box), (1200, 1200), method=Image.Resampling.LANCZOS)
    )
    return variants


def lerp_color(start: tuple[int, int, int], end: tuple[int, int, int], ratio: float) -> tuple[int, int, int]:
    return tuple(int(start[i] + (end[i] - start[i]) * ratio) for i in range(3))


def palette_for(product: Product) -> dict[str, tuple[int, int, int]]:
    if product.category_name == "刺绣服饰":
        return {
            "bg_top": (245, 236, 228),
            "bg_bottom": (225, 205, 188),
            "fabric": (40, 49, 58),
            "accent": (201, 76, 76),
            "accent2": (236, 175, 94),
            "accent3": (118, 156, 112),
            "line": (29, 33, 38),
        }
    if product.category_name == "扎染服饰":
        return {
            "bg_top": (231, 240, 245),
            "bg_bottom": (178, 206, 222),
            "fabric": (232, 242, 247),
            "accent": (49, 96, 140),
            "accent2": (96, 149, 180),
            "accent3": (209, 226, 235),
            "line": (36, 62, 93),
        }
    return {
        "bg_top": (244, 239, 229),
        "bg_bottom": (219, 207, 183),
        "fabric": (180, 110, 83),
        "accent": (125, 49, 45),
        "accent2": (231, 177, 103),
        "accent3": (105, 121, 82),
        "line": (73, 47, 36),
    }


def gradient_background(size: tuple[int, int], palette: dict[str, tuple[int, int, int]]) -> Image.Image:
    width, height = size
    canvas = Image.new("RGB", size)
    draw = ImageDraw.Draw(canvas)
    for y in range(height):
        ratio = y / max(height - 1, 1)
        color = lerp_color(palette["bg_top"], palette["bg_bottom"], ratio)
        draw.line((0, y, width, y), fill=color)
    draw.ellipse((-140, -80, 460, 420), fill=(255, 255, 255))
    draw.ellipse((width - 420, height - 360, width + 120, height + 80), fill=(255, 250, 245))
    return canvas


def draw_swirl_pattern(
    draw: ImageDraw.ImageDraw,
    bbox: tuple[int, int, int, int],
    palette: dict[str, tuple[int, int, int]],
    density: int = 6,
) -> None:
    left, top, right, bottom = bbox
    width = right - left
    height = bottom - top
    step_x = max(width // density, 60)
    step_y = max(height // density, 60)
    for row, y in enumerate(range(top + 20, bottom - 20, step_y)):
        for col, x in enumerate(range(left + 20, right - 20, step_x)):
            petal_color = [palette["accent"], palette["accent2"], palette["accent3"]][(row + col) % 3]
            draw.ellipse((x - 18, y - 18, x + 18, y + 18), outline=palette["line"], width=2)
            draw.polygon(
                [
                    (x, y - 28),
                    (x + 18, y - 6),
                    (x, y + 12),
                    (x - 18, y - 6),
                ],
                fill=petal_color,
                outline=palette["line"],
            )
            draw.arc((x - 36, y - 24, x + 10, y + 22), 180, 360, fill=palette["accent2"], width=3)
            draw.arc((x - 10, y - 24, x + 36, y + 22), 180, 360, fill=palette["accent3"], width=3)


def draw_jacket(canvas: Image.Image, palette: dict[str, tuple[int, int, int]]) -> None:
    draw = ImageDraw.Draw(canvas)
    body = [(320, 290), (880, 290), (930, 810), (760, 960), (440, 960), (270, 810)]
    left_sleeve = [(230, 360), (320, 320), (350, 780), (180, 790), (135, 560)]
    right_sleeve = [(880, 320), (970, 360), (1065, 560), (1020, 790), (850, 780)]
    for polygon in (left_sleeve, right_sleeve, body):
        draw.polygon(polygon, fill=palette["fabric"], outline=palette["line"])
    draw.rectangle((565, 290, 635, 960), fill=(236, 232, 224), outline=palette["line"], width=2)
    draw.rectangle((505, 230, 695, 315), fill=palette["fabric"], outline=palette["line"], width=3)
    draw_swirl_pattern(draw, (240, 300, 960, 860), palette, density=7)


def draw_shawl(canvas: Image.Image, palette: dict[str, tuple[int, int, int]]) -> None:
    draw = ImageDraw.Draw(canvas)
    draw.polygon(
        [(190, 300), (1010, 300), (1120, 760), (600, 1000), (80, 760)],
        fill=palette["fabric"],
        outline=palette["line"],
    )
    for offset in range(0, 620, 70):
        draw.arc((180 + offset, 300, 500 + offset, 880), 210, 330, fill=palette["accent2"], width=5)
    draw_swirl_pattern(draw, (170, 320, 1030, 830), palette, density=8)


def draw_dress(canvas: Image.Image, palette: dict[str, tuple[int, int, int]]) -> None:
    draw = ImageDraw.Draw(canvas)
    top = [(470, 230), (730, 230), (790, 450), (410, 450)]
    skirt = [(410, 450), (790, 450), (970, 980), (230, 980)]
    for polygon in (top, skirt):
        draw.polygon(polygon, fill=palette["fabric"], outline=palette["line"])
    for i in range(14):
        x = 250 + i * 55
        draw.line((x, 250, x + 120, 980), fill=palette["accent"], width=18)
        draw.line((x + 18, 250, x + 138, 980), fill=palette["accent2"], width=10)
    draw.rectangle((495, 180, 705, 250), fill=palette["fabric"], outline=palette["line"], width=3)


def draw_scarf(canvas: Image.Image, palette: dict[str, tuple[int, int, int]]) -> None:
    draw = ImageDraw.Draw(canvas)
    points = [(250, 290), (860, 250), (990, 420), (370, 980), (210, 820)]
    draw.polygon(points, fill=palette["fabric"], outline=palette["line"])
    for i in range(9):
        draw.arc((220 + i * 65, 260 + i * 28, 520 + i * 65, 640 + i * 28), 190, 330, fill=palette["accent"], width=16)
        draw.arc((230 + i * 65, 310 + i * 28, 500 + i * 65, 680 + i * 28), 190, 330, fill=palette["accent2"], width=8)
    for x in range(300, 960, 34):
        draw.line((x, 880, x + 20, 980), fill=palette["line"], width=3)


def draw_top(canvas: Image.Image, palette: dict[str, tuple[int, int, int]]) -> None:
    draw = ImageDraw.Draw(canvas)
    body = [(330, 270), (870, 270), (930, 820), (270, 820)]
    left_sleeve = [(220, 360), (340, 300), (370, 700), (180, 720), (150, 520)]
    right_sleeve = [(860, 300), (980, 360), (1050, 520), (1020, 720), (830, 700)]
    for polygon in (left_sleeve, right_sleeve, body):
        draw.polygon(polygon, fill=palette["fabric"], outline=palette["line"])
    draw.line((500, 270, 430, 520), fill=(240, 234, 222), width=28)
    draw.line((550, 270, 480, 520), fill=(240, 234, 222), width=28)
    for x, y in ((460, 400), (515, 485), (570, 570)):
        draw.ellipse((x - 22, y - 14, x + 22, y + 14), fill=palette["accent2"], outline=palette["line"], width=2)
        draw.arc((x - 26, y - 18, x + 6, y + 18), 90, 270, fill=palette["line"], width=3)
        draw.arc((x - 6, y - 18, x + 26, y + 18), 270, 90, fill=palette["line"], width=3)


def draw_sachet(canvas: Image.Image, palette: dict[str, tuple[int, int, int]]) -> None:
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((310, 280, 890, 900), radius=90, fill=palette["fabric"], outline=palette["line"], width=4)
    draw.rectangle((540, 150, 660, 290), fill=palette["accent2"], outline=palette["line"], width=3)
    draw.line((600, 120, 600, 210), fill=palette["accent"], width=10)
    draw_swirl_pattern(draw, (360, 350, 840, 840), palette, density=6)
    for x in range(430, 770, 40):
        draw.line((x, 900, x + 20, 980), fill=palette["accent"], width=4)


def draw_bag(canvas: Image.Image, palette: dict[str, tuple[int, int, int]]) -> None:
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((260, 350, 940, 920), radius=80, fill=palette["fabric"], outline=palette["line"], width=4)
    draw.arc((390, 140, 810, 560), 200, 340, fill=palette["line"], width=26)
    draw.arc((440, 190, 760, 510), 200, 340, fill=palette["bg_top"], width=18)
    draw_swirl_pattern(draw, (320, 430, 880, 860), palette, density=6)


def draw_headband(canvas: Image.Image, palette: dict[str, tuple[int, int, int]]) -> None:
    draw = ImageDraw.Draw(canvas)
    draw.arc((240, 120, 960, 1040), 210, 330, fill=palette["fabric"], width=120)
    draw.arc((315, 205, 885, 965), 210, 330, fill=palette["bg_top"], width=70)
    for idx in range(10):
        start = 235 + idx * 8
        end = start + 22
        draw.arc((260, 140, 940, 1020), start, end, fill=palette["accent"], width=20)
    draw_swirl_pattern(draw, (350, 250, 850, 760), palette, density=5)


def make_illustration_set(product: Product) -> list[Image.Image]:
    palette = palette_for(product)
    main = gradient_background((1200, 1200), palette)

    if "jacket" in product.slug:
        draw_jacket(main, palette)
    elif "shawl" in product.slug:
        draw_shawl(main, palette)
    elif "dress" in product.slug:
        draw_dress(main, palette)
    elif "scarf" in product.slug:
        draw_scarf(main, palette)
    elif "top" in product.slug:
        draw_top(main, palette)
    elif "pendant" in product.slug:
        draw_sachet(main, palette)
    elif "handbag" in product.slug:
        draw_bag(main, palette)
    else:
        draw_headband(main, palette)

    detail_1 = gradient_background((1200, 1200), palette)
    draw_swirl_pattern(ImageDraw.Draw(detail_1), (120, 120, 1080, 1080), palette, density=8)

    detail_2 = gradient_background((1200, 1200), palette)
    if "dress" in product.slug or "scarf" in product.slug or "shawl" in product.slug:
        draw_scarf(detail_2, palette)
    elif "pendant" in product.slug:
        draw_sachet(detail_2, palette)
    elif "handbag" in product.slug:
        draw_bag(detail_2, palette)
    elif "top" in product.slug:
        draw_top(detail_2, palette)
    elif "hair" in product.slug:
        draw_headband(detail_2, palette)
    else:
        draw_jacket(detail_2, palette)

    return [main, detail_1, detail_2]


def write_jpgs(product: Product, variants: Iterable[Image.Image]) -> list[dict[str, str]]:
    deliver_dir = MATERIAL_DIR / product.title
    backend_dir = BACKEND_IMAGE_DIR / product.slug
    deliver_dir.mkdir(parents=True, exist_ok=True)
    backend_dir.mkdir(parents=True, exist_ok=True)

    rows: list[dict[str, str]] = []
    for index, img in enumerate(variants, start=1):
        deliver_name = f"{product.title}-{index:02d}.jpg"
        backend_name = f"{index:02d}.jpg"
        deliver_path = deliver_dir / deliver_name
        backend_path = backend_dir / backend_name
        img.save(deliver_path, format="JPEG", quality=92)
        img.save(backend_path, format="JPEG", quality=92)
        rows.append(
            {
                "deliver_name": deliver_name,
                "deliver_path": str(deliver_path.relative_to(ROOT)).replace("\\", "/"),
                "backend_url": f"{BACKEND_BASE_URL}/heritage-products/{product.slug}/{backend_name}",
                "backend_path": str(backend_path.relative_to(ROOT)).replace("\\", "/"),
            }
        )
    return rows


def validate_lengths(products: Iterable[Product]) -> None:
    for product in products:
        subtitle_len = len(product.subtitle)
        description_len = len(product.description)
        craft_len = len(product.craft_intro)
        intro_len = len(product.inheritor_intro)
        assert 15 <= subtitle_len <= 25, f"{product.title} subtitle length {subtitle_len}"
        assert 40 <= description_len <= 80, f"{product.title} description length {description_len}"
        assert 100 <= craft_len <= 200, f"{product.title} craftIntro length {craft_len}"
        assert 60 <= intro_len <= 120, f"{product.title} inheritorIntro length {intro_len}"
        assert 59 <= product.sale_price <= 399, f"{product.title} salePrice out of range"
        assert product.original_price > product.sale_price, f"{product.title} originalPrice invalid"
        assert 10 <= product.stock <= 100, f"{product.title} stock out of range"


def csv_write(path: Path, headers: list[str], rows: list[dict[str, object]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)


def sql_quote(value: object) -> str:
    if value is None:
        return "NULL"
    if isinstance(value, (int, float)):
        return str(value)
    text = str(value).replace("\\", "\\\\").replace("'", "''")
    return f"'{text}'"


def build_sql(products: list[Product], image_rows: dict[int, list[dict[str, str]]]) -> str:
    category_values = [
        f"({product.category_id}, {sql_quote(TIMESTAMP)}, {sql_quote(TIMESTAMP)}, NULL, "
        f"{sql_quote(product.category_name)}, {index}, 1, {sql_quote('AI整理后的课程作业数据')}, 0)"
        for index, product in enumerate(
            {p.category_id: p for p in products}.values()
        )
    ]

    product_values = []
    sku_values = []
    image_values = []
    image_id = 2001
    sku_id = 1001
    for sort_order, product in enumerate(products):
        product_values.append(
            "("
            f"{product.product_id}, {sql_quote(TIMESTAMP)}, {sql_quote(TIMESTAMP)}, NULL, "
            f"{product.category_id}, {sql_quote(product.title)}, {sql_quote(product.subtitle)}, "
            f"{sql_quote(product.description)}, {sql_quote(product.craft_intro)}, "
            f"{sql_quote(product.inheritor_name)}, {sql_quote(product.inheritor_intro)}, "
            f"{product.sale_price:.2f}, {product.sale_price:.2f}, 1, {sort_order}, 0"
            ")"
        )
        sku_code = re.sub(r"[^A-Z0-9]", "", product.slug.upper().replace("-", ""))
        sku_values.append(
            "("
            f"{sku_id}, {sql_quote(TIMESTAMP)}, {sql_quote(TIMESTAMP)}, NULL, {product.product_id}, "
            f"{sql_quote(f'SKU-{sku_code}')}, {sql_quote(product.sku_name)}, "
            f"JSON_ARRAY({sql_quote(product.specs)}), {product.sale_price:.2f}, {product.original_price:.2f}, "
            f"{product.stock}, 1, 0, 0"
            ")"
        )
        sku_id += 1
        for idx, row in enumerate(image_rows[product.product_id]):
            image_values.append(
                "("
                f"{image_id}, {sql_quote(TIMESTAMP)}, {sql_quote(TIMESTAMP)}, NULL, {product.product_id}, "
                f"{sql_quote(row['backend_url'])}, {1 if idx == 0 else 0}, {idx}, 0"
                ")"
            )
            image_id += 1

    return "\n".join(
        [
            "SET NAMES utf8mb4;",
            "SET FOREIGN_KEY_CHECKS = 0;",
            "",
            "DELETE FROM `favorite`;",
            "DELETE FROM `product_image`;",
            "DELETE FROM `product_sku`;",
            "DELETE FROM `product`;",
            "DELETE FROM `product_category`;",
            "",
            "INSERT INTO `product_category`",
            "  (`id`, `createTime`, `updateTime`, `tenantId`, `name`, `sortOrder`, `status`, `remark`, `deleted`)",
            "VALUES",
            "  " + ",\n  ".join(category_values) + ";",
            "",
            "INSERT INTO `product`",
            "  (`id`, `createTime`, `updateTime`, `tenantId`, `categoryId`, `title`, `subtitle`, `description`, `craftIntro`, `inheritorName`, `inheritorIntro`, `minPrice`, `maxPrice`, `status`, `sortOrder`, `deleted`)",
            "VALUES",
            "  " + ",\n  ".join(product_values) + ";",
            "",
            "INSERT INTO `product_sku`",
            "  (`id`, `createTime`, `updateTime`, `tenantId`, `productId`, `code`, `name`, `specs`, `salePrice`, `originalPrice`, `stock`, `status`, `sortOrder`, `deleted`)",
            "VALUES",
            "  " + ",\n  ".join(sku_values) + ";",
            "",
            "INSERT INTO `product_image`",
            "  (`id`, `createTime`, `updateTime`, `tenantId`, `productId`, `url`, `isMain`, `sortOrder`, `deleted`)",
            "VALUES",
            "  " + ",\n  ".join(image_values) + ";",
            "",
            "SET FOREIGN_KEY_CHECKS = 1;",
            "",
        ]
    )


def sync_init_sql(seed_sql: str) -> None:
    original = INIT_SQL.read_text(encoding="utf-8")
    start_marker = "INSERT INTO `product_category`"
    end_marker = "CREATE TABLE IF NOT EXISTS `user_info` ("
    start = original.index(start_marker)
    end = original.index(end_marker)
    seed_body = seed_sql
    for prefix in ("SET NAMES utf8mb4;\n", "SET FOREIGN_KEY_CHECKS = 0;\n\n"):
        if seed_body.startswith(prefix):
            seed_body = seed_body[len(prefix) :]
    suffix = "\nSET FOREIGN_KEY_CHECKS = 1;\n"
    if seed_body.endswith(suffix):
        seed_body = seed_body[: -len(suffix)]
    updated = original[:start] + seed_body + "\n" + original[end:]
    INIT_SQL.write_text(updated, encoding="utf-8")


def main() -> None:
    validate_lengths(PRODUCTS)
    clean_output_dirs()

    copy_rows: list[dict[str, object]] = []
    sku_rows: list[dict[str, object]] = []
    final_rows: list[dict[str, object]] = []
    manifest_rows: list[dict[str, object]] = []
    payload: list[dict[str, object]] = []
    image_rows_by_product: dict[int, list[dict[str, str]]] = {}

    for product in PRODUCTS:
        file_rows = write_jpgs(product, make_illustration_set(product))
        image_rows_by_product[product.product_id] = file_rows

        copy_rows.append(
            {
                "title": product.title,
                "subtitle": product.subtitle,
                "description": product.description,
                "craftIntro": product.craft_intro,
                "inheritorName": product.inheritor_name,
                "inheritorIntro": product.inheritor_intro,
            }
        )
        sku_rows.append(
            {
                "categoryName": product.category_name,
                "title": product.title,
                "skuName": product.sku_name,
                "specs": product.specs,
                "salePrice": product.sale_price,
                "originalPrice": product.original_price,
                "stock": product.stock,
                "status": 1,
            }
        )
        final_rows.append(
            {
                "categoryName": product.category_name,
                "title": product.title,
                "subtitle": product.subtitle,
                "description": product.description,
                "craftIntro": product.craft_intro,
                "inheritorName": product.inheritor_name,
                "inheritorIntro": product.inheritor_intro,
                "skuName": product.sku_name,
                "specs": product.specs,
                "salePrice": product.sale_price,
                "originalPrice": product.original_price,
                "stock": product.stock,
                "status": 1,
            }
        )
        payload.append(
            {
                "categoryId": product.category_id,
                "categoryName": product.category_name,
                "title": product.title,
                "subtitle": product.subtitle,
                "description": product.description,
                "craftIntro": product.craft_intro,
                "inheritorName": product.inheritor_name,
                "inheritorIntro": product.inheritor_intro,
                "status": 1,
                "skus": [
                    {
                        "name": product.sku_name,
                        "salePrice": product.sale_price,
                        "originalPrice": product.original_price,
                        "stock": product.stock,
                        "status": 1,
                        "specs": [product.specs],
                    }
                ],
                "images": [
                    {
                        "url": row["backend_url"],
                        "isMain": 1 if index == 0 else 0,
                        "sortOrder": index,
                    }
                    for index, row in enumerate(file_rows)
                ],
            }
        )
        for index, row in enumerate(file_rows, start=1):
            manifest_rows.append(
                {
                    "title": product.title,
                    "localFile": row["deliver_path"],
                    "backendFile": row["backend_path"],
                    "backendUrl": row["backend_url"],
                    "sourceLabel": f"generated_{index:02d}",
                    "sourcePage": "",
                    "sourceAsset": "",
                    "note": "Locally generated illustration for coursework demo delivery",
                    "slot": index,
                }
            )

    csv_write(
        OUTPUT_DIR / "商品文案表.csv",
        ["title", "subtitle", "description", "craftIntro", "inheritorName", "inheritorIntro"],
        copy_rows,
    )
    csv_write(
        OUTPUT_DIR / "分类SKU价格库存表.csv",
        ["categoryName", "title", "skuName", "specs", "salePrice", "originalPrice", "stock", "status"],
        sku_rows,
    )
    csv_write(
        OUTPUT_DIR / "最终总表.csv",
        [
            "categoryName",
            "title",
            "subtitle",
            "description",
            "craftIntro",
            "inheritorName",
            "inheritorIntro",
            "skuName",
            "specs",
            "salePrice",
            "originalPrice",
            "stock",
            "status",
        ],
        final_rows,
    )
    csv_write(
        SOURCE_MANIFEST,
        [
            "title",
            "localFile",
            "backendFile",
            "backendUrl",
            "sourceLabel",
            "sourcePage",
            "sourceAsset",
            "note",
            "slot",
        ],
        manifest_rows,
    )
    JSON_OUTPUT.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    seed_sql = build_sql(list(PRODUCTS), image_rows_by_product)
    SQL_OUTPUT.write_text(seed_sql, encoding="utf-8")
    sync_init_sql(seed_sql)

    print("Generated deliverables:")
    print(f"- {OUTPUT_DIR}")
    print(f"- {BACKEND_IMAGE_DIR}")
    print(f"- {SQL_OUTPUT}")


if __name__ == "__main__":
    main()
