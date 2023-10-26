import React, { useContext } from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';

function HorizontalScrollMenu({ items, handleClick, isItemSelected }) {
    return (
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
            {items.map(({ id }) => (
                <Card
                    itemId={id}
                    title={id}
                    key={id}
                    onClick={handleClick(id)}
                    selected={isItemSelected(id)}
                />
            ))}
        </ScrollMenu>
    );
}

function LeftArrow() {
    const { isFirstItemVisible, scrollPrev } =
        React.useContext(VisibilityContext);

    return (
        <button disabled={isFirstItemVisible} onClick={() => scrollPrev()}>
            Left
        </button>
    );
}

function RightArrow() {
    const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);

    return (
        <button disabled={isLastItemVisible} onClick={() => scrollNext()}>
            Right
        </button>
    );
}

function Card({ onClick, selected, title, itemId }) {
    // Use useContext to access VisibilityContext
    const visibility = useContext(VisibilityContext);

    return (
        <div
            onClick={() => onClick(itemId)}
            style={{
                width: '160px',
            }}
            tabIndex={0}
        >
            <div className="card">
                <div>{title}</div>
                <div>visible: {JSON.stringify(!!visibility.isItemVisible(itemId))}</div>
                <div>selected: {JSON.stringify(selected)}</div>
            </div>
            <div
                style={{
                    height: '200px',
                }}
            />
        </div>
    );
}


export default HorizontalScrollMenu;
