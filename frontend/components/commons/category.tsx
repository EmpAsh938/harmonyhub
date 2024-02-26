"use client";

import { useState } from "react";
import CategoryCard from "./category/card";
import ChannelCard from "./channel/card";
import { ChannelInterface } from "@/types/interfaces/channel";


type Props = {
    categoryName: string;
    channels: ChannelInterface[];
}

const Category = (props: Props) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const toggleCollapse = (value: boolean) => {
        setIsCollapsed(value);
    }
    return (
        <div className="mt-4">
            <CategoryCard categoryName={props.categoryName} isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
            {(isCollapsed && props.channels.length > 0) ? props.channels.map(item => {
                return <div key={item._id}>
                    <ChannelCard {...item} />
                </div>
            }) : (
                null
            )}
        </div>
    );
}

export default Category;