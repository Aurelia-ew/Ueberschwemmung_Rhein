from pathlib import Path
from zipfile import ZipFile

import requests
import requests.adapters
from tqdm.auto import tqdm
from urllib3 import Retry


def download(url: str, destfile: str | Path, *, overwrite: bool = True) -> None:
    """Hilfsfunktion, um Dateien herunterzuladen."""
    destfile = Path(destfile)
    if destfile.exists() and not overwrite:
        print("File already exists, not overwriting.")
        return

    # make sure parent directories exist
    destfile.parent.mkdir(parents=True, exist_ok=True)

    print("Downloading", destfile, "from", url)
    session = requests.Session()
    # Configure retries in case connection is interrupted
    retry_adapter = requests.adapters.HTTPAdapter(max_retries=Retry(total=4, backoff_factor=0.1))
    # register retry adapter for https connections
    session.mount("https://", retry_adapter)
    session.mount("http://", retry_adapter)
    # Stream file so we don't have to load the whole file into memory
    with session.get(url, allow_redirects=True, stream=True) as response:
        response.raise_for_status()
        content_length = int(response.headers.get("Content-Length", 0)) or None

        with (
            destfile.open("wb") as file,
            tqdm(total=content_length, unit="B", unit_scale=True) as pbar,
        ):
            for chunk in response.iter_content(8 * 1024):
                file.write(chunk)
                pbar.update(len(chunk))


def unzip(source: str | Path, dest: str | Path) -> None:
    """Hilfsfunktion, um ZIP-Dateien zu entpacken."""
    with ZipFile(source, "r") as zz:
        # We don't overwrite already extracted files:
        for item in zz.infolist():
            file_path = Path(dest) / item.filename
            if not file_path.exists():
                zz.extract(item, dest)
