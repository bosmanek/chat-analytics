import "@assets/styles/Card.less";

import { BlockDataType, BlockInfo, BlockKey, BlockState } from "@pipeline/aggregate/Blocks";
import Block from "@report/components/Block";

import Spinner from "@assets/images/icons/spinner.svg";

interface Props<K extends BlockKey> {
    num: 1 | 2 | 3;
    title?: string | (string | string[])[];
    blockKey: K;
    children: (props: { data?: BlockDataType<K> }) => JSX.Element;
}

const Indicators: { [key in BlockState]: string } = {
    loading: "⚙️",
    stale: "⌛",
    error: "❌",
    ready: "✅",
};

const Card = <K extends BlockKey>(props: Props<K>) => {
    const titleElems: JSX.Element[] = [];
    if (props.title) {
        const titleArr = typeof props.title === "string" ? [props.title] : props.title;

        for (const _options of titleArr) {
            const options = Array.isArray(_options) ? _options : [_options];
            if (options.length === 1) {
                titleElems.push(<span key={options[0]}>{options[0]}</span>);
            } else {
                titleElems.push(
                    <select key={options[0]}>
                        {options.map((option, i) => (
                            <option key={i}>{option}</option>
                        ))}
                    </select>
                );
            }
        }
    }

    const Content = <K extends BlockKey>({ info }: { info: BlockInfo<K> }) => (
        <>
            {titleElems.length ? <div className="Card_title">{titleElems}</div> : null}
            <props.children data={info.data || undefined} />
            <div className={"Card_overlay" + (info.state === "ready" ? " Card_overlay--hidden" : "")}>
                <img src={Spinner} alt="Loading" height={60} />
                {Indicators[info.state]}
            </div>
        </>
    );

    return (
        <div className={"Card Card--" + props.num}>
            <Block blockKey={props.blockKey} children={Content} />
        </div>
    );
};

export default Card;
