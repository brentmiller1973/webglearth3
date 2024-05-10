class BasicMarker extends AbstractMarker {
  constructor(lat, lon) {
    const image = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3Zn' +
        'PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjMy' +
        'IiB3aWR0aD0iMTYiIHZlcnNpb249IjEuMSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUo' +
        'MCwtMTAyMC4zNjIyKSI+PHBhdGggc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZD0ibTE1' +
        'LDcuODdjMCwzLjQ3LTIuNzcsNi4yOC02LjE5LDYuMjhzLTYuMTktMi44MS02LjE5LTYu' +
        'MjgsMi43Ny02LjI4LDYuMTktNi4yOCw2LjE5LDIuODEsNi4xOSw2LjI4em0tNi4xNiwy' +
        'My4ydi0xNi41IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRl' +
        'KC0wLjcwNzEwNjc4LDEwMjAuNzE1OCkiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVj' +
        'YXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjFweCIgZmlsbD0iI2UxMzUxZSIvPjwvZz48' +
        '/L3N2Zz4=';

    const elementStyle = 'position:absolute;width:16px;height:32px;' +
        'background-image:url(data:image/svg+xml;base64,' + image +
        ');margin:-32px 0 0 -8px;opacity:0.8;';

    const el = document.createElement('div');
    el.style = elementStyle;

    super(lat, lon, el);

    this.show(false);
  }
}
