interface Prize {
    name: string;
    emoji: string;
    probability: number;
}

const canvas = document.getElementById("wheel") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const spinButton = document.getElementById("spinButton") as HTMLButtonElement;
const resultBox = document.getElementById("resultBox") as HTMLDivElement;
const result = document.getElementById("result") as HTMLDivElement;

const center = canvas.width / 2;
const radius = 285;

const prizes: Prize[] = [
    {
        name: "FREE SPIN",
        emoji: "🎁",
        probability: 40
    },
    {
        name: "SURPRISE BOX",
        emoji: "🎉",
        probability: 10
    },
    {
        name: "THANK YOU",
        emoji: "🙏",
        probability: 40
    },
    {
        name: "ETHIO TELECOM PACKAGE",
        emoji: "📱",
        probability: 5
    },
    {
        name: "THANK YOU",
        emoji: "🙏",
        probability: 5
    }
];

const colors: string[] = [
    "#d9d9d9",
    "#bdbdbd",
    "#eeeeee",
    "#c9c9c9",
    "#aaaaaa"
];

const sectionAngle = (Math.PI * 2) / prizes.length;

let rotation = 0;
let spinning = false;

function drawWheel(): void {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.save();

    ctx.translate(center, center);
    ctx.rotate(rotation);

    for (let i = 0; i < prizes.length; i++) {

        const startAngle =
            -Math.PI / 2 +
            i * sectionAngle;

        const endAngle =
            startAngle +
            sectionAngle;

        ctx.beginPath();

        ctx.moveTo(0, 0);

        ctx.arc(
            0,
            0,
            radius,
            startAngle,
            endAngle
        );

        ctx.closePath();

        ctx.fillStyle = colors[i];
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 5;
        ctx.stroke();

        const middleAngle =
            startAngle +
            sectionAngle / 2;

        const textRadius =
            radius * 0.63;

        const textX =
            Math.cos(middleAngle) *
            textRadius;

        const textY =
            Math.sin(middleAngle) *
            textRadius;

        ctx.save();

        ctx.translate(
            textX,
            textY
        );

        let textRotation =
            middleAngle +
            Math.PI / 2;

        if (
            textRotation > Math.PI / 2 &&
            textRotation < Math.PI * 1.5
        ) {
            textRotation += Math.PI;
        }

        ctx.rotate(textRotation);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = "40px Arial";

        ctx.fillText(
            prizes[i].emoji,
            0,
            -25
        );

        ctx.fillStyle = "#222";

        if (
            prizes[i].name ===
            "ETHIO TELECOM PACKAGE"
        ) {

            ctx.font =
                "bold 14px Arial";

            ctx.fillText(
                "ETHIO TELECOM",
                0,
                8
            );

            ctx.fillText(
                "PACKAGE",
                0,
                29
            );

        } else {

            const words =
                prizes[i].name.split(" ");

            ctx.font =
                "bold 18px Arial";

            if (words.length === 2) {

                ctx.fillText(
                    words[0],
                    0,
                    8
                );

                ctx.fillText(
                    words[1],
                    0,
                    30
                );

            } else {

                ctx.fillText(
                    prizes[i].name,
                    0,
                    10
                );
            }
        }

        ctx.restore();
    }

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        radius,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle = "#222";
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        70,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#222";
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.restore();
}

function choosePrize(): number {

    const random =
        Math.random() * 100;

    let total = 0;

    for (
        let i = 0;
        i < prizes.length;
        i++
    ) {

        total +=
            prizes[i].probability;

        if (random < total) {
            return i;
        }
    }

    return prizes.length - 1;
}

function showResult(prize: Prize): void {

    resultBox.classList.remove(
        "free-spin",
        "surprise",
        "thank-you"
    );

    void resultBox.offsetWidth;

    result.textContent =
        `${prize.emoji} ${prize.name}`;

    if (prize.name === "FREE SPIN") {

        resultBox.classList.add(
            "free-spin"
        );

    } else if (
        prize.name === "SURPRISE BOX"
    ) {

        resultBox.classList.add(
            "surprise"
        );

    } else {

        resultBox.classList.add(
            "thank-you"
        );
    }
}

function spin(): void {

    if (spinning) {
        return;
    }

    spinning = true;

    spinButton.disabled = true;

    spinButton.classList.add(
        "disabled"
    );

    resultBox.classList.remove(
        "free-spin",
        "surprise",
        "thank-you"
    );

    result.textContent =
        "SPINNING...";

    const selectedIndex =
        choosePrize();

    const selectedPrize =
        prizes[selectedIndex];

    const prizeAngle =
        -Math.PI / 2 +
        selectedIndex * sectionAngle +
        sectionAngle / 2;

    const pointerAngle =
        -Math.PI / 2;

    let targetRotation =
        pointerAngle -
        prizeAngle -
        rotation;

    targetRotation =
        (
            targetRotation %
            (Math.PI * 2) +
            Math.PI * 2
        ) %
        (Math.PI * 2);

    const fullSpins =
        6 +
        Math.floor(
            Math.random() * 3
        );

    targetRotation +=
        fullSpins *
        Math.PI *
        2;

    const startRotation =
        rotation;

    const duration = 5000;

    const startTime =
        performance.now();

    function animate(time: number): void {

        const elapsed =
            time -
            startTime;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );

        const eased =
            1 -
            Math.pow(
                1 - progress,
                5
            );

        rotation =
            startRotation +
            targetRotation *
            eased;

        drawWheel();

        if (progress < 1) {

            requestAnimationFrame(
                animate
            );

        } else {

            rotation =
                startRotation +
                targetRotation;

            drawWheel();

            showResult(
                selectedPrize
            );

            spinning = false;

            spinButton.disabled =
                false;

            spinButton.classList.remove(
                "disabled"
            );
        }
    }

    requestAnimationFrame(
        animate
    );
}

spinButton.addEventListener(
    "click",
    spin
);

drawWheel();