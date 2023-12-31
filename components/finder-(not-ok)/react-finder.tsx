"use client";

import * as Finder from "finderjs";
import React, { Component } from "react";
// @ts-ignore
import * as uuidv4 from "uuid/v4";
import "finderjs/example/finderjs.css";

const defaultProps = {
	className: "",
	createItemContent: undefined,
	data: [],
	disableAutoScroll: false,
	onItemSelected: null,
	onLeafSelected: null,
	onColumnCreated: null,
	value: null,
};

export class ReactFinder extends Component<
	{ data: any; className: string },
	{}
> {
	_container: HTMLDivElement;
	_componentId: string;
	_finder: Finder;
	constructor(props) {
		super(props);

		this._componentId = uuidv4.default();
		this._finder = undefined;

		this.createColumn = this.createColumn.bind(this);
		this.navigate = this.navigate.bind(this);
		this._getSelectedValuePath = this._getSelectedValuePath.bind(this);
		this._initializeFinder = this._initializeFinder.bind(this);
		this._onItemSelected = this._onItemSelected.bind(this);
		this._onLeafSelected = this._onLeafSelected.bind(this);
		this._onCreateColumn = this._onCreateColumn.bind(this);
		this._selectValue = this._selectValue.bind(this);
	}

	componentDidMount() {
		this._initializeFinder();
	}

	UNSAFE_componentWillUpdate(nextProps: { data: any }) {
		if (nextProps.data !== this.props.data) {
			this._componentId = uuidv4.default();
			console.log("UNSAFE_componentWillUpdate", this._componentId);
			this._finder = undefined;
		}
	}

	componentDidUpdate(prevProps, prevState) {
		this._initializeFinder();
	}

	render() {
		let className = "c-finder ";

		if (this.props.className !== undefined) {
			className += this.props.className;
		}

		return (
			<div className={className}>
				<div id={this._componentId} />
			</div>
		);
	}

	// --------------
	// Public Methods
	// --------------

	createColumn(item) {
		if (this._finder === undefined || item === undefined) {
			return;
		}

		this._finder.emit("create-column", item);
	}

	navigate(direction) {
		if (
			this._finder === undefined ||
			direction === undefined ||
			direction.length === 0
		) {
			return;
		}

		this._finder.emit("navigate", { direction: direction });
	}

	// ---------------
	// Private Methods
	// ---------------

	_getSelectedValuePath(value, data) {
		let result = [];

		if (data === undefined) {
			data = this.props.data;
		}

		const i = data.findIndex((e) => e.id === value.id);
		if (i > -1) {
			result.push(i);
			return result;
		}

		data.some((e, i) => {
			if (e.children !== undefined && e.children.length > 0) {
				const ci = this._getSelectedValuePath(value, e.children);
				if (ci.length > 0) {
					result = result.concat([i], ci);
					return true;
				}
				return false;
			}
		});

		return result;
	}

	_initializeFinder() {
		if (this._finder === undefined && this.props.data !== undefined) {
			this._container = document.getElementById(this._componentId);
			if (!this._container) {
				return;
			}
			console.log("finder", {
				componentId: this._componentId,
				container: this._container,
			});
			this._finder = Finder.default(this._container, this.props.data, {
				className: this.props.className,
				createItemContent: this.props.createItemContent,
			});
			this._finder.on("leaf-selected", this._onLeafSelected);
			this._finder.on("item-selected", this._onItemSelected);
			this._finder.on("column-created", this._onCreateColumn);

			this._selectValue();
		}
	}

	_selectValue() {
		if (
			this._container !== undefined &&
			this.props.value !== undefined &&
			this.props.value.id !== undefined &&
			this.props.data !== undefined
		) {
			const path = this._getSelectedValuePath(this.props.value);
			let itemData = {
				children: this.props.data,
			};

			path.forEach((index, i) => {
				const cols = this._container.querySelectorAll(".fjs-col");
				const item = cols[i].querySelectorAll("li")[index];
				if (item !== undefined) {
					itemData = itemData.children[index];
					item._item = itemData;
					this._finder.emit("item-selected", { col: cols[i], item: item });
				}
			});
		}
	}

	// --------------
	// Event Handlers
	// --------------

	_onItemSelected(item) {
		if (
			this.props.onItemSelected !== undefined &&
			item !== undefined &&
			item.item !== undefined &&
			item.item._item !== undefined
		) {
			this.props.onItemSelected(item.item._item, item);
		}
	}

	_onLeafSelected(item) {
		if (this.props.onLeafSelected !== undefined) {
			this.props.onLeafSelected(item);
		}
	}

	_onCreateColumn(item) {
		if (this._container !== undefined && !this.props.disableAutoScroll) {
			this._container.scrollLeft =
				this._container.scrollWidth - this._container.clientWidth;
		}

		if (this.props.onColumnCreated !== undefined) {
			this.props.onColumnCreated(item);
		}
	}
}

ReactFinder.defaultProps = defaultProps;
