import Link from "next/link"
import { withRouter } from "next/router";
import { createElement, useEffect, useRef } from "react";
import Landing from "./Landing";

const IndexCard = () => {

    const Containerref = useRef(null);
    const Headingref = useRef(null)

    return (
        <>
            <article className="overflow-hidden mt-5">
                <div ref={Containerref} className="container headContainer">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <header className="Main-Header">
                                <Landing>
                                    <h1 ref={Headingref} className="heading">
                                        <span>B</span>
                                        <span>l</span>
                                        <span>o</span>
                                        <span>g</span>
                                        <span> </span>
                                        <span>F</span>
                                        <span>l</span>
                                        <span>o</span>
                                        <span>w</span>
                                        <span> - </span>
                                        <span>D</span>
                                        <span>e</span>
                                        <span>l</span>
                                        <span>i</span>
                                        <span>g</span>
                                        <span>h</span>
                                        <span>t</span>
                                        <span> i</span>
                                        <span>n</span>
                                        <span> D</span>
                                        <span>e</span>
                                        <span>t</span>
                                        <span>a</span>
                                        <span>i</span>
                                        <span>l</span>
                                        <span>s</span>
                                    </h1>
                                </Landing>
                            </header>
                        </div>
                    </div>
                </div>



                <div className="container-fluid pt-5">
                    <div className="row">
                        <div className="col-md-4">
                            <Link href="/categories/food">
                                <div className="flip flip-horizontal">
                                    <div
                                        className="front"
                                        style={{
                                            backgroundImage:
                                                'url(' +
                                                'https://buzzycity.com/wp-content/uploads/2021/06/Best-Food-Cooking-Blogs.jpg' +
                                                ')'
                                        }}
                                    >
                                        {/* <h2 className="text-center h1">Food</h2> */}
                                    </div>
                                    <div className="back text-center">

                                        <h3 className="h1">Food Blogs</h3>

                                        <div className="lead">If gluttony is a sin, welcome to hell.</div>
                                    </div>
                                </div>
                            </Link>
                        </div>


                        <div className="col-md-4">
                            <Link href="/categories/fashion">
                                <div className="flip flip-horizontal">
                                    <div
                                        className="front"
                                        style={{
                                            backgroundImage:
                                                'url(' +
                                                'https://therabbitholeae.files.wordpress.com/2012/07/fashion-bloggers.png' +
                                                ')'
                                        }}
                                    >
                                        {/* <h2 className="text-center h1 text-dark">Fashion</h2> */}
                                    </div>
                                    <div className="back text-center">

                                        <h3 className="h1">Fashion Blogs</h3>

                                        <div className="lead">
                                            Each day is a page in your fashion story.
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="col-md-4">
                            <Link href="/categories/travel">
                                <div className="flip flip-horizontal">
                                    <div
                                        className="front"
                                        style={{
                                            backgroundImage:
                                                'url(' +
                                                'https://tiesinstitute.com/wp-content/uploads/2021/01/shutterstock_268004744-2.jpg' +
                                                ')'
                                        }}
                                    >
                                        {/* <h2 className="text-center h1">Travel</h2> */}
                                    </div>
                                    <div className="back text-center">

                                        <h3 className="h1">Travel Blogs</h3>

                                        <div className="lead">Journeys, explorations, and adventures.</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        </>
    )
}

export default (IndexCard)