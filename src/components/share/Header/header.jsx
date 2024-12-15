import {Link} from "react-router-dom";

export const Header = () => {
    return (
        <div className={'flex gap-8 text-gray-300 p-4 mb-8'}>
            {/*<Link to={'/market-stats/stats-table'} >Table</Link>*/}
            {/*<Link to={'/market-stats/stats-table-new'} >Table New</Link>*/}
            {/*<Link to={'/market-stats/stats-charts'} >Charts 2023</Link>*/}
            {/*<Link to={'/market-stats/stats-charts-2024'} >Charts 2024</Link>*/}
            <Link to={'/market-stats/stats-charts-es'} >Charts ES</Link>
            <Link to={'/market-stats/stats-charts-nq'} >Charts NQ</Link>
            {/*<Link to={'/market-stats/backtests'} >Backtests</Link>*/}
            {/*<Link to={'/market-stats/backtests-sanya'} >Backtests Sanya</Link>*/}
            {/*<Link to={'/market-stats/backtests-tapok'} >Backtests Tapok</Link>*/}
            {/*<Link to={'/market-stats/backtests-tapok-US500'} >Backtests Tapok US500</Link>*/}
        </div>
    )
}