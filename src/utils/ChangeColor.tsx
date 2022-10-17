import { configs } from './../App';
export function ChangeColor() {
    console.log("function has been loaded");

    const onChange = (data: any) => {
        if (!data || !data.color_scheme) return;

        const color = data.color_scheme.select_variant;
        console.log(color);
        const setTheme = (theme: string) => {
            const root = document.getElementById("theme");
            if (root) root.className = theme;
            console.log("element switched");
        }


        if (!color || color === 'CSGO1') {
            setTheme('CSGO1');
            console.log("tema1");
        }
        if (color === 'CSGO2') {
            setTheme('CSGO2');
            console.log("tema2");
        }
        if (color === 'CSGO3') {
            setTheme('CSGO3');
            console.log("tema3");
        }
        if (color === 'clc') {
            setTheme('clc');
            console.log("tema4");
        }
    }

    configs.onChange(onChange);
    onChange(configs.data)
}