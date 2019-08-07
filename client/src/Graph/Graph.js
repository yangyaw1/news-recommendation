import React from 'react';
import { ForceGraph3D } from 'react-force-graph';
import * as THREE from 'three';

class Graph extends React.Component {

	onClick(node) {
		this.props.handleNodeClick(node);

		// Aim at node from outside it.
		const distance = 60;
		const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
		this.fg.cameraPosition({ x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
			node, // look at {x, y, z})
			3000);
	}

	render() {
		return (
			<div>
        <ForceGraph3D
          ref = { el => { this.fg = el; } }
          width={ window.innerWidth * 0.65 }
          backgroundColor='white'
          linkColor={ link => '#0a6aee' }
          graphData={ this.props.graphData }
          linkWidth={ link => 0.5 }
          onNodeClick={node => this.onClick(node)}
          nodeThreeObject={({ news }) => {
            const imgTexture = new THREE.TextureLoader().load(news.urlToImage);
            const material = new THREE.SpriteMaterial({ map: imgTexture });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(21, 14, 1);
            return sprite;
          }}
        />
			</div>
		);
	}
}

export default Graph;