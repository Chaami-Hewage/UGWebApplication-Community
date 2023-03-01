export interface Theme {
    name: string;
    properties: any;
}

export const light: Theme = {
    name: "light",
    properties: {
        "--primary": "#fd2d01",
        "--secondary": "#093167",
        "--tertiary": "#ffd7d7",
        "--background-white": "#FFF",
        "--background-light": "#f6f6f6",
        "--background-dark": "#eaeaea",
        "--background-darkest": "#5c7d99",
        "--category-background": "#fd2d01",
        "--input-background": "#f6f6f6",
        "--color_text-title": "#433a3a",
        "--color_text-button": "#fff",
        "--alert": "#FF0000",
        "--text-category":"#433a3a",
        "--text-post":"#433a3a"
    },
};

export const dark: Theme = {
    name: "dark",
    properties: {
        "--primary": "#F69D50",
        "--secondary": "#529BF5",
        "--tertiary": "#FFDAD5",
        "--background-white": "#242526",
        "--background-light": "#18191A",
        "--background-dark": "#eaeaea",
        "--background-darkest": "#5c7d99",
        "--category-background": "#18191A",
        "--input-background": "#4E4F50",
        "--color_text-title": "#AFBAC5",
        "--color_text-button": "#fff",
        "--alert": "#FF0000",
        "--text-category":"#E7E9ED",
        "--text-post":"#E7E9ED"
    },
};
