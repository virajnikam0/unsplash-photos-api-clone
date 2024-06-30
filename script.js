const API_KEY = "SouHY7Uul-OxoMl3LL3c0NkxUtjIrKwf3tsGk1JaiVo";

dayNightTheme = () => {
	let date = new Date();
	let hour = date.getHours();

	if (hour >= 7 && hour < 19) {
		document.body.style.backgroundColor = "white";
		document.body.style.color = "black";
	} else {
		document.body.style.backgroundColor = "black";
		document.body.style.color = "white";
	}
};

window.addEventListener("load", dayNightTheme);

document.querySelector("#input").addEventListener("keydown", (event) => {
	if (event.key == "Enter") {
		apiRequest();
	}
});

document.querySelector("#search").addEventListener("click", () => {
	apiRequest();
});

apiRequest = () => {
	document.querySelector("#grid").textContent = "";
	const inputText = document.querySelector("#input").value;
	const url =
		"https://api.unsplash.com/search/photos?query=" +
		inputText +
		"&per_page=30&client_id=" +
		API_KEY;

	fetch(url)
		.then((response) => {
			if (!response.ok) throw Error(response.statusText);
			return response.json();
		})
		.then((data) => {
			if (data && data?.results?.length > 0) {
				loadImages(data);
			} else {
				document.querySelector(
					"#grid"
				).textContent = `No result found ); ${input.value}`;
				throw new Error(`No result found: ${input.value}`);
			}
		})
		.catch((error) => {
			alert(error);
		});
};

function loadImages(data) {
	for (let i = 0; i < data.results.length; i++) {
		//add img into card
		let image = document.createElement("div");
		image.className = "img";
		image.id = `img_${i}`;
		image.style.backgroundImage =
			"url(" + data.results[i].urls.raw + "&w=1366&h=768" + ")";
		image.addEventListener("dblclick", function () {
			window.open(data.results[i].links.download, "_blank");
		});
		document.querySelector("#grid").appendChild(image);

		//add download btn into card
		const downloadUrl = `${data.results[i].urls.full}&client_id=${API_KEY}.jpg`;

		let downloadBtnRef = document.createElement("button");
		downloadBtnRef.className = "btn btn-warning";
		downloadBtnRef.id = `downloadBtn_${i}`;
		downloadBtnRef.innerHTML = `<i id="downloadIcon" class="fas fa-download"></i>`;

		downloadBtnRef.addEventListener("click", () => {
			fetch(downloadUrl)
				.then((resp) => resp.blob())
				.then((blob) => {
					const url = window.URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = `DownloadedImage_${data.results[i].id}`;
					document.body.appendChild(a);
					a.click();
					a.remove();
				})
				.catch(() => alert("An error occurred, while downloading img );"));
		});
		document.querySelector(`#img_${i}`).appendChild(downloadBtnRef);
	}
}
