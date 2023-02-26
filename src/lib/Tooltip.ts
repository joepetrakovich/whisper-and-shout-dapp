export function tooltip(node: HTMLElement) {
    let tip = new bootstrap.Tooltip(node);
    //tip.setContent({ '.tooltip-inner': content });
	return {
		update: (newContent: string) => {
           // tip.setContent({ '.tooltip-inner': newContent })
		},
		destroy: () => {
			tip.dispose();
		}
	}
}


	